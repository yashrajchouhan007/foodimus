<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Helpers\MealIcon;
use App\Helpers\Recipes;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class MealsController extends Controller
{
    public function view(Request $request)
    {
        $data = [];

        $date = $request->date;

        /** @var \App\Models\User $user */
        $user = Auth::user();

        /** @var \App\Models\Program $template */
        $userProgram = $user->userMealPlans()
            ->orderBy('id', 'desc')
            ->with('program', 'program.influencer', 'program.influencer.avatar')
            ->first();
        $template = $userProgram === null ? null : $userProgram->program;

        $remoteMealplan = \App\Helpers\User::getActiveMealPlan(
            $user,
            includeMeals: true,
            includeRecipe: true,
            includeNutrients: true
        );

        $today = Carbon::now($user->userDetails->timezone)->toDateString();

        if ($template === null || $remoteMealplan === null || count(array_filter($remoteMealplan->days, function ($i) use (
            $today
        ) {
            return $i->date >= $today;
        })) === 0) {
            return Redirect::route('overview')
                ->with('message', __('overview.message.no-active-plan'));
        }

        $days = collect($remoteMealplan->days);
        $p = [
            'program_name' => $template->name,
            'user_name' => $user->firstname,
        ];
        $data['tip'] = [
            'ambassador' => $template->influencer,
            'ambassadorTitle' => __('meals.tip.ambassador-title', $p),
            'text' => __('meals.tip.text', $p),
        ];
        $data['currentMealPlan'] = [
            'startDate' => $days->map(function ($i) {
                return $i->date;
            })->min(),
            'endDate' => $days->map(function ($i) {
                return $i->date;
            })->max(),
        ];
        /** @var \App\Http\Resources\MealPlanDay $day */
        $day = $days->first(function ($i) use ($date) {
            return $i->date === $date;
        });

        if ($day) {
            $meals = collect($day->meals);
            $recipes = Recipes::getLocalRecipesForMeals($meals);

            $data['currentDay'] = [
                'date' => $day->date,
                'meals' => $meals->map(function ($meal) use ($recipes) {
                    /** @var \App\Http\Resources\Meal $meal */

                    /** @var \App\Models\Recipe $recipe */
                    $recipe = $recipes[$meal->recipe->databaseId];
                    $servings = $meal->numOfServings;

                    return [
                        'slug' => $recipe->slug,
                        'mealType' => $meal->meal,
                        'name' => $meal->recipe->name,
                        'mealIcon' => MealIcon::getIcon($meal->meal),
                        'mealIconColor' => MealIcon::getColor($meal->meal),
                        'calories' => $servings * round($meal->recipe->nutrientsPerServing->calories),
                        'protein' => $servings * round($meal->recipe->nutrientsPerServing->protein),
                        'carbs' => $servings * round($meal->recipe->nutrientsPerServing->carbs),
                        'fat' => $servings * round($meal->recipe->nutrientsPerServing->fat),
                    ];
                }),
            ];
        } else {
            throw new NotFoundHttpException();
        }

        return Inertia::render('MyFoodimus/Meals', $data);
    }
}
