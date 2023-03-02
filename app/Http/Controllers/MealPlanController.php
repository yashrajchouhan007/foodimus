<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Helpers\Arrays;
use App\Helpers\MealIcon;
use App\Helpers\Suggestic;
use App\Models\User;
use App\Models\UserMealPlan;
use App\Services\Repositories\MealPlanRepository;
use App\Services\Repositories\ShoppingListRepository;
use App\Services\Repositories\UserRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\PreconditionFailedHttpException;
use Symfony\Component\HttpKernel\Exception\ServiceUnavailableHttpException;

class MealPlanController extends Controller
{
    public function view(Request $request)
    {
        //TODO: clean this up
        $data = [];

        $slug = $request->slug;

        /** @var \App\Models\Program $detail */
        $detail = \App\Models\Program::whereSlug($slug)->wherePublished(true)
            ->with('influencer', 'influencer.avatar', 'headerImage')
            ->first();

        if ($detail === null) {
            throw new NotFoundHttpException();
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $today = Carbon::now($user->userDetails->timezone)->toDateString();

        /** @var \App\Models\UserMealPlan $current */
        $current = $user->userMealPlans()
            ->where('plan_end', '>=', $today)
            ->orderBy('id', 'desc')
            ->first();

        $data['isCurrent'] = $current !== null && $current->program_id === $detail->id;
        $data['activeSince'] = $data['isCurrent'] ? Carbon::parse($current->plan_start)->toDateString() : null;

        $sg_item = $detail->getRemoteObject(includeMeals: true, includeRecipe: true, includeNutrients: true);
        if ($sg_item === null) {
            throw new NotFoundHttpException();
        }

        $data['header'] = [
            'ambassador' => $detail->influencer->toArray(),
            'title' => $detail->name,
            'heroImg' => $detail->headerImage === null ? null : [
                'src' => $detail->headerImage->src,
                'focus' => [$detail->headerImage->focus_x, $detail->headerImage->focus_y],
            ],
        ];
        $data['story'] = $detail->story;
        $dayCount = $detail->total_days;
        $days = collect($sg_item->days);
        $meals = collect(Arrays::flatten($days, 'meals'));

        $data['days'] = $days->map(function ($day) {
            $meals = collect($day->meals);
            return [
                'day' => $day->day,
                'meals' => $meals->map(
                    function ($meal) {
                        return [
                            'heroImage' => [
                                'src' => $meal->recipe->mainImage,
                                'focus' => [0.5, 0.5],
                            ],
                            'icon' => MealIcon::getIcon($meal->meal),
                            'iconColor' => MealIcon::getColor($meal->meal),
                            'mealType' => $meal->meal,
                            'name' => $meal->recipe->name,
                        ];
                    },
                ),
            ];
        });

        $nutrients = array_reduce($sg_item->days, function ($arr, $day) use ($dayCount) {
            return array_reduce($day->meals, function ($sum, $meal) use ($dayCount) {
                /** @var \App\Http\Resources\Meal $meal */
                $servings = $meal->numOfServings;
                $nutrients = $meal->recipe->nutrientsPerServing;
                $sum['protein'] += ($servings * $nutrients->protein) / $dayCount;
                $sum['carbs'] += ($servings * $nutrients->carbs) / $dayCount;
                $sum['calories'] += ($servings * $nutrients->calories) / $dayCount;
                $sum['fat'] += ($servings * $nutrients->fat) / $dayCount;
                $sum['fiber'] += ($servings * $nutrients->fiber) / $dayCount;
                return $sum;
            }, $arr);
        }, [
            'protein' => 0,
            'carbs' => 0,
            'calories' => 0,
            'fat' => 0,
            'fiber' => 0,
        ]);

        $data['nutrition'] = [];

        $data['nutrition']['averageNutrients'] = array_map(function ($i) {
            return round($i);
        }, $nutrients);

        $meals = Arrays::flatten($sg_item->days, function ($i) {
            return $i->meals;
        });
        $mealCount = count($meals);

        $data['nutrition']['averageCookingMinutes'] = round(array_sum(array_map(function ($i) {
            return $i->recipe->totalTimeInSeconds / 60.0;
        }, $meals)) / $mealCount);

        $data['nutrition']['cookingLevel'] = round(array_sum(array_map(function ($i) {
            return [
                'simple' => 1,
                'regular' => 2,
            ][$i->recipe->recipeType];
        }, $meals)) / $mealCount);
        $data['userHasMealPlan'] = false;
        try {
            $data['userHasMealPlan'] = \App\Helpers\User::getActiveMealPlan($user, check_remaining_days: true) !== null;
        } catch (\Exception $e) {
        }
        //TODO: fix this
        //$data['nutrition']['averagePortions'] = round(array_sum(array_map(function ($i) {
        //    return $i->numOfServings;
        //}, $meals)) / $mealCount);
        //$data['nutrition']['category'] = "Losing weight";
        //$data['nutrition']['allergens'] = ["Celery", "Shellfish"];

        return Inertia::render('MyFoodimus/MealPlan', $data);
    }

    public function activate(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        $today = Carbon::now($user->userDetails->timezone)->toDateString();

        $slug = $request->slug;

        \App\Helpers\User::ensureRemoteUser($user);

        if ($user->suggestic_profile === null) {
            throw new PreconditionFailedHttpException();
        }

        /** @var \App\Models\Program $templateDetail */
        $templateDetail = \App\Models\Program::whereSlug($slug)->wherePublished(true)->first();
        if ($templateDetail === null) {
            throw new NotFoundHttpException();
        }

        //TODO: think of a way to combine these requests into a single one
        try {
            if (! Suggestic::syncUserProfile($user)) {
                error_log('failed to sync user profile');
                throw new ServiceUnavailableHttpException();
            }
            $profile = $user->getRemoteProfileStub();

            if (! UserRepository::setProgram($user->suggestic_user, $templateDetail->suggestic_program_id)) {
                error_log('Failed to set user program');
                throw new ServiceUnavailableHttpException();
            }

            if (! MealPlanRepository::clear($user->suggestic_user)) {
                error_log('Failed to clear meal plan, it\' probably already empty');
                //throw new ServiceUnavailableHttpException();
            }

            if (! ShoppingListRepository::clear($user->suggestic_user)) {
                error_log('Failed to clear shopping list');
                throw new ServiceUnavailableHttpException();
            }

            if (! MealPlanRepository::generateExtended($user->suggestic_user, $profile->dailyCaloricIntakeGoal)) {
                error_log('Failed to generate meal plan');
                throw new ServiceUnavailableHttpException();
            }

            $user->clearRemoteMealPlanCache();
            $days = $user->getRemoteMealPlan(fromDate: $today, includeMeals: true, includeRecipe: true);
            if ($days === null) {
                error_log('Failed to fetch remote meal plan');
                throw new ServiceUnavailableHttpException();
            }
            $recipes = collect(Arrays::flatten($days->days, function ($day) {
                /** @var \App\Http\Resources\MealPlanDay $day */
                return $day->meals;
            }))->map(function ($meal) {
                /** @var \App\Http\Resources\Meal $meal */
                return [
                    'recipe' => $meal->recipe,
                    'servings' => $meal->numOfServings,
                ];
            });

            if (! \App\Http\Resources\Recipe::ensureLocal($recipes->map(function ($i) {
                return $i['recipe'];
            }))) {
                error_log('Unable to sync recipes');
                throw new ServiceUnavailableHttpException();
            }

            $recipe_set = $recipes->map(function ($i) {
                return [
                    'id' => $i['recipe']->id,
                    'servings' => $i['servings'],
                ];
            })->toArray();

            if (! ShoppingListRepository::add($user->suggestic_user, $recipe_set)) {
                error_log('Failed to update shopping list');
                throw new ServiceUnavailableHttpException();
            }

            $dates = collect($days->days)
                ->map(function ($day) {
                    /** @var \App\Http\Resources\MealPlanDay $day */
                    return $day->date;
                });

            UserMealPlan::create([
                'user_id' => $user->id,
                'program_id' => $templateDetail->id,
                'plan_start' => $dates->min(),
                'plan_end' => $dates->max(),
            ]);
        } catch (\Exception $e) {
            \Sentry\captureException($e);
            return back()->with([
                'error' => __('errors.meal-plan-activation-failed'),
            ]);
        }

        return Redirect::route('overview');
    }
}
