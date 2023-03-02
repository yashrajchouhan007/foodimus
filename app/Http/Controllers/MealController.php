<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Helpers\Ingredients;
use App\Helpers\MealIcon;
use App\Helpers\Recipes;
use App\Models\Recipe;
use App\Models\RecipeImage;
use App\Services\Repositories\ShoppingListRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * MealController
 */
class MealController extends Controller
{
    protected string $date;

    protected string $slug;

    protected array $data;

    protected \App\Models\Recipe $recipe;

    protected \App\Models\User $user;

    protected \App\Models\Program $template;

    // These are not actually instances but they adhere to the interface

    /**
     * @var \App\Http\Resources\MealPlanDay
     */
    protected $day;

    /**
     * @var \App\Http\Resources\Meal
     */
    protected $meal;

    public function info(Request $request)
    {
        $this->loadCommonResources($request);

        if (! $this->data['hasStory']) {
            return Redirect::route('ingredients', [
                'slug' => $this->slug,
                'date' => $this->date,
            ]);
        }

        $this->data['mealText'] = $this->recipe->story;

        return Inertia::render('MyFoodimus/meal/Meal', $this->data);
    }

    public function ingredients(Request $request)
    {
        $this->loadCommonResources($request);

        //$remoteRecipe = $this->recipe->getRemoteObject(includeIngredients: true);
        $ingredients = Cache::remember(
            "Suggestic-UserRecipeIngredients-{$this->user->suggestic_user}-{$this->recipe->suggestic_id}",
            3600,
            function () {
                return ShoppingListRepository::getForRecipe(
                    $this->user->suggestic_user,
                    $this->recipe->suggestic_id
                )->items;
            }
        );

        $this->data['ingredients'] = collect($ingredients)->map(function ($item) {
            /** @var \App\Http\Resources\ShoppingListItem $item */
            return [
                'name' => preg_replace_callback('/^[a-z]/m', function ($m) {
                    return strtoupper($m[0]);
                }, $item->ingredient),
                ...Ingredients::getQuantity($item),
            ];
        });
        $p = [
            'program_name' => $this->template->name,
            'user_name' => $this->user->firstname,
        ];
        $this->data['tip'] = [
            'ambassador' => $this->template->influencer,
            'ambassadorTitle' => __('meal.ingredients.tip.ambassador-title', $p),
            'text' => __('meal.ingredients.tip.text', $p),
            'button' => __('meal.ingredients.tip.button.label', $p),
            'buttonTarget' => 'shopping-list',
            'buttonTargetParam' => [
                'date' => $this->date,
                'slug' => $this->slug,
            ],
        ];
        return Inertia::render('MyFoodimus/meal/Ingredients', $this->data);
    }

    public function recipe(Request $request)
    {
        $this->loadCommonResources($request);

        $remoteRecipe = $this->recipe->getRemoteObject(includeSteps: true);

        $p = [
            'program_name' => $this->template->name,
            'user_name' => $this->user->firstname,
        ];
        $this->data['tip'] = [
            'ambassador' => $this->template->influencer,
            'ambassadorTitle' => __('meal.recipe.tip.ambassador-title', $p),
            'text' => __('meal.recipe.tip.text', $p),
            'button' => __('meal.recipe.tip.button.label', $p),
            'buttonTarget' => 'shopping-list',
            'buttonTargetParam' => [
                'date' => $this->date,
                'slug' => $this->slug,
            ],
        ];

        $this->data['steps'] = $remoteRecipe->instructions;
        return Inertia::render('MyFoodimus/meal/Recipe', $this->data);
    }

    public function nutrition(Request $request)
    {
        $this->loadCommonResources($request);

        $servings = $this->meal->numOfServings;
        $nutrients = $this->meal->recipe->nutrientsPerServing;

        $this->data['nutrients'] = [];

        if ($nutrients->protein !== null) {
            $this->data['nutrients'][] = [
                'name' => __('meal.nutrients.protein.name'),
                'unit' => __('meal.nutrients.protein.unit'),
                'amount' => $servings * $nutrients->protein,
            ];
        }
        if ($nutrients->carbs !== null) {
            $this->data['nutrients'][] = [
                'name' => __('meal.nutrients.carbs.name'),
                'unit' => __('meal.nutrients.carbs.unit'),
                'amount' => $servings * $nutrients->carbs,
            ];
        }
        if ($nutrients->fat !== null) {
            $this->data['nutrients'][] = [
                'name' => __('meal.nutrients.fat.name'),
                'unit' => __('meal.nutrients.fat.unit'),
                'amount' => $servings * $nutrients->fat,
            ];
        }
        if ($nutrients->fiber !== null) {
            $this->data['nutrients'][] = [
                'name' => __('meal.nutrients.fiber.name'),
                'unit' => __('meal.nutrients.fiber.unit'),
                'amount' => $servings * $nutrients->fiber,
            ];
        }
        if ($nutrients->calories !== null) {
            $this->data['nutrients'][] = [
                'name' => __('meal.nutrients.calories.name'),
                'unit' => __('meal.nutrients.calories.unit'),
                'amount' => $servings * $nutrients->calories,
            ];
        }
        return Inertia::render('MyFoodimus/meal/Nutrition', $this->data);
    }

    protected function loadCommonResources(Request $request)
    {
        $this->data = [];

        $this->date = $request->date;
        $this->slug = $request->slug;

        $this->recipe = Recipe::whereSlug($this->slug)->first();
        if ($this->recipe === null) {
            throw new NotFoundHttpException();
        }

        $this->user = Auth::user();

        /** @var \App\Models\Program $template */
        $userProgram = $this->user->userMealPlans()
            ->orderBy('id', 'desc')
            ->with('program', 'program.influencer', 'program.influencer.avatar', 'program.influencer.overlayImage')
            ->first();
        $this->template = $userProgram === null ? null : $userProgram->program;

        $remoteMealplan = \App\Helpers\User::getActiveMealPlan(
            $this->user,
            includeMeals: true,
            includeRecipe: true,
            includeNutrients: true
        );

        $days = collect($remoteMealplan ? $remoteMealplan->days : []);
        $this->day = $days
            ->first(function ($day) {
                return $day->date === $this->date;
            });

        $this->meal = collect($this->day->meals)
            ->first(function ($meal) {
                return $meal->recipe->databaseId === $this->recipe->suggestic_id;
            });

        if ($this->meal === null) {
            throw new NotFoundHttpException();
        }

        $heroImage = RecipeImage::whereRecipeId($this->recipe->id)
            ->where('image_type', 'hero')
            ->with('image')
            ->first();

        $this->data['meal'] = [
            'ambassador' => $this->template->influencer->toArray(overlayImage: true),
            'heroImg' => $heroImage !== null ? $heroImage->image : null,
            'mealType' => $this->meal->meal,
            'icon' => MealIcon::getIcon($this->meal->meal),
            'name' => $this->meal->recipe->name,
            'servings' => $this->meal->numOfServings,
            'recipeServings' => $this->meal->recipe->serving,
        ];

        $images = RecipeImage::whereRecipeId($this->recipe->id)
            ->limit(5)
            ->with('image')
            ->get();
        $this->data['mealPictures'] = $images->map(function ($i) {
            return $i->image;
        });

        $this->data['currentMealPlan'] = [
            'startDate' => $days
                ->min(function ($i) {
                    return $i->date;
                }),
            'endDate' => $days
                ->max(function ($i) {
                    return $i->date;
                }),
        ];
        $meals = collect($this->day->meals);

        $recipes = Recipes::getLocalRecipesForMeals($meals);

        $this->data['currentDay'] = [
            'date' => $this->day->date,
            'meals' => $meals->map(
                function ($meal) use ($recipes) {
                    /** @var \App\Http\Resources\Meal $meal */
                    $servings = $meal->numOfServings;
                    return [
                        'slug' => $recipes[$meal->recipe->databaseId]->slug,
                        'mealType' => $meal->meal,
                        'name' => $meal->recipe->name,
                        'mealIcon' => MealIcon::getIcon($meal->meal),
                        'mealIconColor' => MealIcon::getColor($meal->meal),
                        'calories' => $servings * $meal->recipe->nutrientsPerServing->calories,
                        'protein' => $servings * $meal->recipe->nutrientsPerServing->protein,
                        'carbs' => $servings * $meal->recipe->nutrientsPerServing->carbs,
                        'fat' => $servings * $meal->recipe->nutrientsPerServing->fat,
                    ];
                }
            ),
        ];

        $this->data['hasStory'] = $this->recipe->story !== null && $this->recipe->story !== '';
    }
}
