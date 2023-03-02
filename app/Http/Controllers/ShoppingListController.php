<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Helpers\Arrays;
use App\Helpers\Ingredients;
use App\Helpers\MealIcon;
use App\Helpers\Recipes;
use App\Helpers\Slugify;
use App\Models\Recipe;
use App\Services\Repositories\ShoppingListRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ShoppingListController extends Controller
{
    protected string|null $date;

    protected string|null $slug;

    protected array $data;

    protected \App\Models\User $user;

    protected \App\Models\Program $template;

    // These are not actually instances but they adhere to the interface

    /**
     * @var \App\Http\Resources\MealPlanDay
     */
    protected $day;

    public function view(Request $request)
    {
        $this->data = [];

        $this->user = Auth::user();

        $today = Carbon::now($this->user->userDetails->timezone)->toDateString();

        if ($request->date === null) {
            return Redirect::route('shopping-list', [
                'date' => $today,
            ]);
        }
        //if ($request->slug === null && $request->date !== 'mealplan') {
        //    return Redirect::route('shopping-list', [
        //        'date' => 'mealplan',
        //    ]);
        //}

        $this->date = $request->date === 'mealplan' ? null : $request->date;
        $this->slug = $request->slug;

        $userProgram = $this->user->userMealPlans()
            ->orderBy('id', 'desc')
            ->with('program', 'program.influencer', 'program.influencer.avatar', 'program.influencer.overlayImage')
            ->first();
        /** @var \App\Models\Program $activeTemplate */
        $activeTemplate = $userProgram === null ? null : $userProgram->program;

        $remoteMealplan = \App\Helpers\User::getActiveMealPlan(
            $this->user,
            includeMeals: true,
            includeRecipe: true,
            includeNutrients: false
        );

        if (
            $activeTemplate === null || $remoteMealplan === null
            || count(array_filter($remoteMealplan->days, function ($i) use ($today) {
                return $i->date >= $today;
            })) === 0
        ) {
            return Redirect::route('overview')
                ->with('message', __('overview.message.no-active-plan'));
        }

        $this->template = $activeTemplate;

        $this->data['currentMealPlan'] = [
            'name' => $this->template->name,
            'startDate' => collect($remoteMealplan->days)
                ->min(function ($i) {
                    return $i->date;
                }),
            'endDate' => collect($remoteMealplan->days)
                ->max(function ($i) {
                    return $i->date;
                }),
        ];
        $mealDay = $this->date !== null ? $this->date : $today;
        $this->day = collect($remoteMealplan->days)
            ->first(function ($day) use ($mealDay) {
                return $day->date === $mealDay;
            });

        $meals = collect($this->day->meals);
        $remoteRecipes = Recipes::getRemoteRecipesForMeals($meals);
        $remoteRecipesById = Arrays::byKey($remoteRecipes, 'databaseId');
        $recipeIds = collect(array_keys($remoteRecipesById));
        $recipes = Recipes::getLocalRecipes($remoteRecipes);

        $this->data['currentDay'] = [
            'date' => $this->day->date,
            'meals' => $meals->map(
                function ($meal) use ($recipes) {
                    /** @var \App\Http\Resources\Meal $meal */
                    return [
                        'slug' => $recipes[$meal->recipe->databaseId]->slug,
                        'mealType' => $meal->meal,
                        'name' => $meal->recipe->name,
                        'mealIcon' => MealIcon::getIcon($meal->meal),
                        'mealIconColor' => MealIcon::getColor($meal->meal),
                    ];
                }
            ),
        ];

        $shoppingLists = [];

        if ($this->date === null) {

            // Meal plan view

            $shoppingList = ShoppingListRepository::getForMealPlan($this->user->suggestic_user);

            $shoppingLists[] = [
                'mealName' => null,
                'mealSlug' => null,
                'items' => $shoppingList->items,
            ];
        } elseif ($this->slug === null) {

            // Day view

            $recipeCount = $recipeIds->count();
            $myShoppingLists = collect(ShoppingListRepository::getForRecipes(
                $this->user->suggestic_user,
                $recipeIds->toArray()
            ));
            for ($i = 0; $i < $recipeCount; $i++) {
                $shoppingList = $myShoppingLists[$i];
                $recipe = $recipes[$recipeIds[$i]];
                $shoppingLists[] = [
                    'mealName' => $remoteRecipesById[$recipe->suggestic_id]->name,
                    'mealSlug' => $recipe->slug,
                    'items' => $shoppingList->items,
                ];
            }
        } else {

            // Single meal view

            /** @var Recipe $recipe */
            $recipe = Recipe::whereSlug($this->slug)->first();
            $shoppingList = ShoppingListRepository::getForRecipe(
                $this->user->suggestic_user,
                $recipe->suggestic_id
            );
            $shoppingLists[] = [
                'mealName' => $remoteRecipesById[$recipe->suggestic_id]->name,
                'mealSlug' => $recipe->slug,
                'items' => $shoppingList->items,
            ];
        }
        if (count($shoppingLists) > 0) {
            $this->data['shoppingLists'] = collect($shoppingLists)->map(function ($shoppingList) {
                return [
                    'mealName' => $shoppingList['mealName'],
                    'mealSlug' => $shoppingList['mealSlug'],
                    'items' => $shoppingList['items']->map(
                        function ($i) {
                            /** @var \App\Http\Resources\ShoppingListItem $item */
                            return [
                                'id' => Slugify::slugify($i->ingredient),
                                'name' => $i->ingredient,
                                'listItemIds' => $i->getListItemIds(),
                                ...Ingredients::getQuantity($i),
                            ];
                        }
                    )->toArray(),
                ];
            })->toArray();
        }

        return Inertia::render('MyFoodimus/ShoppingList', $this->data);
    }
}
