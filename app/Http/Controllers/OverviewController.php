<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OverviewController extends Controller
{
    private const SHOW_PREVIOUS_PLANS = 5;

    public function view(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $data = [];

        $ids = $user->userMealPlans()
            ->select('program_id')
            ->orderBy('id', 'desc')
            ->distinct('program_id')
            ->limit(self::SHOW_PREVIOUS_PLANS + 1)
            ->get()
            ->map(function ($a) {
                return $a->program_id;
            })
            ->toArray();

        /** @var Collection $mealPlans */
        $mealPlans = \App\Models\Program::whereIn('id', $ids)
            ->with('heroImage', 'influencer', 'influencer.avatar')
            ->get();

        $mealPlanHistory = $mealPlans->sortBy(function ($u) use ($ids) {
            return array_search($u->id, $ids, true);
        })->values();

        $today = Carbon::now($user->userDetails->timezone)->toDateString();

        if (count($mealPlanHistory) > 0) {

            /** @var \App\Models\Program $detail */
            $detail = $mealPlanHistory[0];

            $userMealPlan = \App\Models\UserMealPlan::whereUserId($user->id)
                ->orderBy('id', 'desc')
                ->first();

            $days = $userMealPlan
                ? $user->getRemoteMealPlan(fromDate: $userMealPlan->plan_start, includeMeals: true)
                : null;

            $total_days = count($days->days);
            $days_left = count(array_filter($days->days, function ($i) use ($today) {
                return Carbon::parse($i->date)->toDateString() >= $today;
            }));
            if ($days && $days_left > 0) {
                if ($days !== null && $detail !== null) {
                    $current_day = count(array_filter($days->days, function ($i) use ($today) {
                        return Carbon::parse($i->date)->toDateString() <= $today;
                    }));

                    $p = [
                        'ambassador_name' => $detail->influencer->short_name,
                        'program_name' => $detail->name,
                        'user_name' => $user->firstname,
                    ];

                    $data['currentMealPlan'] = array_merge(
                        $detail->toArray(),
                        [
                            'totalDays' => $total_days,
                            'caption' => __('overview.plan.caption', $p),
                            'currentDay' => $current_day,
                        ]
                    );

                    $data['tip'] = [
                        'ambassador' => $detail->influencer,
                        'ambassadorTitle' => __('overview.tip.ambassador-title', $p),
                        'text' => __('overview.tip.text', $p),
                    ];
                }
                $mealPlanHistory = $mealPlanHistory->slice(1, self::SHOW_PREVIOUS_PLANS);
            } else {
                $mealPlanHistory = $mealPlanHistory->slice(0, self::SHOW_PREVIOUS_PLANS);
            }
        }

        if (count($mealPlanHistory) > 0) {
            $data['previousMealPlans'] = [];

            foreach ($mealPlanHistory as $detail) {
                /** @var \App\Models\Program $detail */

                $data['previousMealPlans'][] = array_merge(
                    $detail->toArray(),
                    [
                        'caption' => __('overview.plan.caption', [
                            'ambassador_name' => $detail->influencer->short_name,
                        ]),
                    ]
                );
            }
        }
        return Inertia::render('MyFoodimus/Overview', $data);
    }
}
