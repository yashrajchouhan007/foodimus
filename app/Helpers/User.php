<?php

declare(strict_types=1);

namespace App\Helpers;

use Carbon\Carbon;
use Symfony\Component\HttpKernel\Exception\ServiceUnavailableHttpException;

class User
{
    public static function getActiveMealPlan(
        \App\Models\User $user,
        bool $includeMeals = false,
        bool $includeRecipe = false,
        bool $includeNutrients = false,
        bool $check_remaining_days = false,
    ) {
        $todayObj = Carbon::now($user->userDetails->timezone);
        $userMealPlan = \App\Models\UserMealPlan::whereUserId($user->id)
            ->orderBy('id', 'desc')
            ->first();
        if ($check_remaining_days) {
            if ($userMealPlan === null) {
                return null;
            }
            if (Carbon::parse($userMealPlan->plan_end, $user->userDetails->timezone) < $todayObj) {
                return null;
            }
        }
        $mealplan = $userMealPlan
            ? $user->getRemoteMealPlan(
                fromDate: $userMealPlan->plan_start,
                includeMeals: $includeMeals,
                includeRecipe: $includeRecipe,
                includeNutrients: $includeNutrients,
            )
            : null;

        if ($mealplan === null) {
            return null;
        }
        if (! $check_remaining_days) {
            return $mealplan;
        }
        $today = $todayObj->toDateString();
        if (
            count(array_filter($mealplan->days, function ($i) use ($today) {
                return $i->date >= $today;
            })) === 0
        ) {
            return null;
        }
        return $mealplan;
    }

    public static function ensureRemoteUser(\App\Models\User $user)
    {
        if ($user->suggestic_user === null) {
            $pfx = env('SUGGESTIC_USER_PREFIX');
            $user_id = "${pfx}$user->id";
            // no reason to give Suggestic identifiable data from our users
            $email = "${user_id}@user.foodimus.com";
            $userId = \App\Services\Repositories\UserRepository::getIdByEmail($email);
            if ($userId) {
                $user->suggestic_user = Suggestic::ensureDbId('User', $userId);
            } else {
                $usrResp = \App\Services\Repositories\UserRepository::create("${user_id}", $email);
                if (
                    ! isset($usrResp->success) || $usrResp->success === false
                    || ! isset($usrResp->user) || ! isset($usrResp->user->databaseId)
                ) {
                    throw new ServiceUnavailableHttpException();
                }
                $user->suggestic_user = $usrResp->user->databaseId;
            }
        }
        if ($user->suggestic_profile === null) {
            // lookup the profile ID from suggestic
            // as this is static and looking it up every time seems less efficient
            $pflResp = $user->getRemoteProfileStub();

            if (! isset($pflResp->id) || $pflResp->id === null) {
                throw new ServiceUnavailableHttpException();
            }

            $user->suggestic_profile = $pflResp->id;
        }
        $user->save();
    }

    public static function getPaymentMethodDetails(\App\Models\User $user)
    {
        return [
            'publicKey' => getenv('STRIPE_KEY'),
            'secret' => $user->createSetupIntent()
                ->client_secret,
            'billing' => array_filter([
                'name' => $user->firstname . ' ' . $user->lastname,
                'email' => $user->email,
                'phone' => $user->phone,
            ], function ($v) {
                return $v !== null;
            }),
        ];
    }
}
