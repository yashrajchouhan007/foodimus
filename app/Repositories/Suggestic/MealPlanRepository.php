<?php

declare(strict_types=1);

namespace App\Repositories\Suggestic;

use App\Helpers\Suggestic;
use App\Http\Resources\Meal;
use App\Http\Resources\MealPlan;
use Carbon\Carbon;

const DEFAULT_DISTRIBUTION = [
    'breakfast' => [
        'min' => .2,
        'max' => .3,
    ],
    'lunch' => [
        'min' => .25,
        'max' => .35,
    ],
    'dinner' => [
        'min' => .25,
        'max' => .35,
    ],
    'snack' => [
        'min' => .1,
        'max' => .2,
    ],
];
class MealPlanRepository implements \App\Repositories\MealPlanRepositoryInterface
{
    /**
     * View current meal plan
     *
     * @return mixed
     */
    public function get(
        string $user_id,
        string $from_date,
        bool $include_meals = false,
        bool $include_recipe = false,
        bool $include_nutrients = false
    ): \App\Http\Resources\MealPlan {
        $nutrientsQuery = '';
        if ($include_nutrients) {
            $nutrientsQuery = <<<GQL
      nutrientsPerServing{
        protein
        carbs
        calories
        fat
        fiber            
      }
      GQL;
        }
        $recipeQuery = '';
        if ($include_recipe) {
            $recipeQuery = <<<GQL
      recipe{
        id
        databaseId
        cleanName
        name
        mainImage
        squareImage
        totalTimeInSeconds
        recipeType
        rating
        text
        serving
        ${nutrientsQuery}
      }
      GQL;
        }
        $mealsQuery = '';
        if ($include_meals) {
            $mealsQuery = <<<GQL
        meals {
          id
          maxNumOfServings
          calories
          meal
          numOfServings
          ${recipeQuery}
        }
      GQL;
        }
        $query = <<<GQL
      query{
        days:mealPlan{
          id
          day
          date(useDatetime: false)
          ${mealsQuery}
        }
      }
    GQL;
        $date = Carbon::parse($from_date)->toDateString();
        $result = Suggestic::run($query, userId: $user_id)->data;
        $result->days = array_filter($result->days, function ($i) use ($date) {
            return $i->date >= $date;
        });
        return MealPlan::make($result);
    }

    public function clear(string $user_id): bool
    {
        $query = <<<GQL
        mutation{
          result:removeMealPlan{
            success
          }
        }
      GQL;
        return Suggestic::run($query, userId: $user_id)->data->result->success;
    }

    public function generate(string $user_id): bool
    {
        $query = <<<GQL
        mutation{
          result:generateMealPlan(
            ignoreLock: true
          ){
            success
          }
        }
      GQL;
        return Suggestic::run($query, userId: $user_id)->data->result->success;
    }

    public function generateExtended(
        string $user_id,
        int $kcal_target,
        array $tags = null,
        array $distribution = null
    ): bool {
        if (! $distribution) {
            $distribution = DEFAULT_DISTRIBUTION;
        }
        $filters = [];
        $filters['kcalRange'] = [
            'breakfast' => [
                'min' => round($kcal_target * $distribution['breakfast']['min']),
                'max' => round($kcal_target * $distribution['breakfast']['max']),
            ],
            'lunch' => [
                'min' => round($kcal_target * $distribution['lunch']['min']),
                'max' => round($kcal_target * $distribution['lunch']['max']),
            ],
            'dinner' => [
                'min' => round($kcal_target * $distribution['dinner']['min']),
                'max' => round($kcal_target * $distribution['dinner']['max']),
            ],
            'snack' => [
                'min' => round($kcal_target * $distribution['snack']['min']),
                'max' => round($kcal_target * $distribution['snack']['max']),
            ],
        ];
        if ($tags) {
            $filters['tags'] = [
                'breakfast' => $tags,
                'dinner' => $tags,
                'lunch' => $tags,
                'snack' => $tags,
            ];
        }
        $query = <<<'GQL'
        mutation($filters:SimpleMPFiltersInput){
          result:generateSimpleMealPlan(
            boostAdherence:true
            ignoreLock:true
            filters:$filters
          ){
            success
            message
          }
        }
      GQL;
        return Suggestic::run($query, userId: $user_id, params: [
            'filters' => $filters,
        ])->data->result->success;
    }
}
