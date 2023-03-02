<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\UserDetail;
use Illuminate\Http\Request;


use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserPersonalController extends Controller
{
    public function view()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        /** @var \App\Models\UserDetail $detail */
        $detail = $user->userDetails;

        $data = [
            'preferences' => [
                'applyGoals' => ! ! $detail->apply_goals,
                'unitType' => $detail->unit_type,
                'timezone' => $detail->timezone,
            ],
            'timezones' => \DateTimeZone::listIdentifiers(),
        ];

        return Inertia::render('MyFoodimus/user/Personal', $data);
    }

    public function viewAllergies()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $user_allergies = $user->allergies()
            ->get()
            ->map(function ($a) {
                return $a->id;
            })->toArray();
        $data = [
            'allergies' => [
                'checked' => $user_allergies,
                'options' => \App\Models\Allergy::all()->map(function ($a) {
                    return [
                        'value' => $a->id,
                        'label' => $a->name,
                    ];
                }),
            ],
        ];
        return Inertia::render('MyFoodimus/user/Allergies', $data);
    }

    public function viewGoals()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        /** @var \App\Models\UserDetail $detail */
        $detail = $user->userDetails;

        list($unitSet, $heightUnit, $weightUnit) = [
            $detail->unit_type => ['metric', 'cm', 'kg'],
            UserDetail::IMPERIAL => ['imperial', 'ft', 'lbs'],
            UserDetail::METRIC => ['metric', 'cm', 'kg'],
        ][$detail->unit_type];

        $data = [
            'preferences' => [
                'applyGoals' => ! ! $detail->apply_goals,
            ],
            'goals' => [
                'weight' => $detail->weight,
                'height' => $detail->height,
                'targetWeight' => $detail->target_weight,
                'activityLevel' => $detail->activity_level,
                'weeklyGoal' => $detail->weekly_goal,
            ],
            'units' => [
                'set' => $unitSet,
                'weight' => $weightUnit,
                'height' => $heightUnit,
                'targetWeight' => $weightUnit,
            ],
            'activityLevels' => [
                UserDetail::NO_EXERCISE => 'no-exercise',
                UserDetail::EXERCISE_ONCE_TWICE => 'exercise-1',
                UserDetail::EXERCISE_THRICE_PLUS => 'exercise-2',
            ],
            'weeklyGoals' => [
                UserDetail::WEEKLY_MAINTAIN => 'maintain',
                UserDetail::WEEKLY_LOSE_HALF_LBS => 'goal-1',
                UserDetail::WEEKLY_LOSE_FULL_LBS => 'goal-2',
                UserDetail::WEEKLY_LOSE_ONE_AND_HALF_LBS => 'goal-3',
                UserDetail::WEEKLY_LOSE_FOUR_LBS => 'goal-4',
            ],
        ];

        return Inertia::render('MyFoodimus/user/Goals', $data);
    }

    public function storePreferences(Request $request)
    {

        /** @var \App\Models\User $user */
        $user = Auth::user();
        /** @var \App\Models\UserDetail $detail */
        $detail = $user->userDetails;

        $request->validate([
            // no required fields because unchanged fields aren't posted
            'applyGoals' => ['boolean'],
            'unitType' => ['int', Rule::in([UserDetail::METRIC, UserDetail::IMPERIAL])],
            'timezone' => ['string', Rule::in(\DateTimeZone::listIdentifiers())],
        ]);

        if ($request->applyGoals !== null) {
            $detail->apply_goals = $request->applyGoals;
        }
        if ($request->unitType !== null) {
            $detail->unit_type = $request->unitType;
        }
        if ($request->timezone !== null) {
            $detail->timezone = $request->timezone;
        }

        if ($detail->isDirty()) {
            $detail->save();
        }

        return Redirect::route('user-personal')->with([
            'success' => __('settings.preferences.saved'),
        ]);
    }

    public function storeGoals(Request $request)
    {

        /** @var \App\Models\User $user */
        $user = Auth::user();
        /** @var \App\Models\UserDetail $detail */
        $detail = $user->userDetails;

        $request->validate([
            // no required fields because unchanged fields aren't posted
            'weight' => ['numeric'],
            'height' => ['numeric'],
            'targetWeight' => ['numeric'],
            'activityLevel' => ['string', Rule::in([
                UserDetail::NO_EXERCISE,
                UserDetail::EXERCISE_ONCE_TWICE,
                UserDetail::EXERCISE_THRICE_PLUS,
            ])],
            'weeklyGoal' => ['string', Rule::in([
                UserDetail::WEEKLY_MAINTAIN,
                UserDetail::WEEKLY_LOSE_HALF_LBS,
                UserDetail::WEEKLY_LOSE_FULL_LBS,
                UserDetail::WEEKLY_LOSE_ONE_AND_HALF_LBS,
                UserDetail::WEEKLY_LOSE_FOUR_LBS,
            ])],
        ]);

        if ($request->weight !== null) {
            $detail->weight = $request->weight;
        }
        if ($request->height !== null) {
            $detail->height = $request->height;
        }
        if ($request->targetWeight !== null) {
            $detail->target_weight = $request->targetWeight;
        }
        if ($request->activityLevel !== null) {
            $detail->activity_level = $request->activityLevel;
        }
        if ($request->weeklyGoal !== null) {
            $detail->weekly_goal = $request->weeklyGoal;
        }

        if ($detail->isDirty()) {
            $detail->save();
        }

        return Redirect::route('user-personal-goals')->with([
            'success' => __('settings.goals.saved'),
        ]);
    }

    public function storeAllergies(Request $request)
    {

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $request->validate([
            // no required fields because unchanged fields aren't posted
            'allergies' => ['array'],
            'allergies.*' => ['exists:allergies,id'],
        ]);

        $user->userAllergies()
            ->whereNotIn('allergy_id', $request->allergies)
            ->delete();
        $existing = $user->userAllergies()
            ->whereIn('allergy_id', $request->allergies)
            ->select('allergy_id')
            ->get()
            ->map(function ($i) {
                return $i->allergy_id;
            })->toArray();

        $new = array_filter($request->allergies, function ($i) use ($existing) {
            return ! in_array($i, $existing, true);
        });

        if (count($new)) {
            \App\Models\UserAllergy::factory()->createMany(array_map(function ($id) use ($user) {
                return [
                    'user_id' => $user->id,
                    'allergy_id' => $id,
                ];
            }, $new));
        }

        return Redirect::route('user-personal-allergies')->with([
            'success' => __('settings.allergies.saved'),
        ]);
    }
}
