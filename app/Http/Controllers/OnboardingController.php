<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\UserDataStoreRequest;
use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function create()
    {
        return Inertia::render('MyFoodimus/onboarding/Onboarding', [
            'formId' => env('ONBOARDING_TYPEFORM_FORM_ID'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'referer' => ['string'],
            'c' => ['string'],
            'responseId' => ['required', 'string'],
            'timezone' => ['string', Rule::in(\DateTimeZone::listIdentifiers())],
        ]);
        $referer = $request->referer;
        $c = $request->c;
        $responseId = $request->responseId;
        $timezone = $request->timezone === null ? 'UTC' : $request->timezone;

        $data = UserDataStoreRequest::fromTypeform($responseId);
        $exists = User::where('email', $data['email'])->first();
        if ($exists !== null) {
            // redirect existing user to login page
            return Redirect::route('login', [
                'email' => $data['email'],
            ])->with('message', __('auth.account-exists'));
        }
        // TODO: handle country in some better way
        $param = $this->createUser($data, $timezone, country: 'US');
        return Redirect::route('finish-setup', array_merge($param, [
            'c' => $c,
            'referer' => $referer,
        ]));
    }

    private function createUser(UserDataStoreRequest $request, string $userTimezone, string $country)
    {
        // Create Foodimus user
        $user = new User($request->only(['gender', 'firstname', 'lastname', 'email', 'date_of_birth']));
        $user->password = bcrypt(Str::random(32));
        $user->country = $country;
        $user->save();

        // Create linked Suggestic user
        try {
            \App\Helpers\User::ensureRemoteUser($user);
        } catch (\Exception $e) {
            $user->delete();
            throw $e;
        }

        // The user will have to choose a password later, so they need a reset token
        $token = Password::createToken($user);

        // Create user details object
        $userDetails = new UserDetail($request->except([
            'gender',
            'firstname',
            'lastname',
            'email',
            'date_of_birth',
            'is_imperial',
        ]));

        $request->is_imperial ? $userDetails->unit_type = UserDetail::IMPERIAL : $userDetails->unit_type = UserDetail::METRIC;
        $userDetails->apply_goals = true;
        $userDetails->height = number_format((float) $userDetails->height, 2);
        $userDetails->weight = number_format((float) $userDetails->weight, 2);
        $userDetails->target_weight = number_format((float) $userDetails->target_weight, 2);
        $userDetails->timezone = $userTimezone;

        $user->userDetails()
            ->save($userDetails);

        event(new Registered($user));

        return [
            'email' => $user->email,
            'token' => $token,
        ];
    }
}
