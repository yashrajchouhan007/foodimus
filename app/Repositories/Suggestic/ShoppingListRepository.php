<?php

declare(strict_types=1);

namespace App\Repositories\Suggestic;

use App\Helpers\Arrays;
use App\Helpers\Suggestic;
use App\Http\Resources\ShoppingList;
use App\Http\Resources\ShoppingListItem;

class ShoppingListRepository implements \App\Repositories\ShoppingListRepositoryInterface
{
    public function add(string $user_id, array $recipes): bool
    {
        $queryGen = function ($mutations, $params) {
            return <<<GQL
      mutation(
          \$ids: [String]!
          ${params}
      ){
        addResult: addRecipesToShoppingList(
          recipeIds:\$ids
        ){
            success
        }
        ${mutations}
      }
      GQL;
        };
        $recipes = array_map(function ($recipe) {
            $recipe['dbid'] = Suggestic::ensureDbId('Recipe', $recipe['id']);
            $recipe['b64id'] = Suggestic::ensureB64Id('Recipe', $recipe['id']);
            return $recipe;
        }, $recipes);

        $chunks = Arrays::chunk($recipes, 10);

        foreach ($chunks as $chunk) {
            $gql = '';
            $gqlp = '';
            $params = [
                'ids' => array_map(function ($i) {
                    return $i['dbid'];
                }, $chunk),
            ];
            $k = 0;
            foreach ($chunk as $i) {
                $k++;

                $params["id${k}"] = $i['b64id'];
                $params["servings${k}"] = $i['servings'];
                $gqlp .= <<<GQL
          \$id${k}: String!
          \$servings${k}: Int!
        GQL;
                $gql .= <<<GQL
          scale${k}: updateShoppingListRecipeServings(
            recipeId:\$id${k}
            numberOfServings:\$servings${k}
          ){
            success
          }
        GQL;
            }

            $query = $queryGen($gql, $gqlp);
            $success = Suggestic::run($query, userId: $user_id, params: $params)->data->addResult->success;
            if (! $success) {
                return false;
            }
        }
        return true;
    }

    public function clear(string $user_id): bool
    {
        $query = <<<'GQL'
        mutation{
          result:clearShoppingList{
              success
          }
        }
        GQL;

        return Suggestic::run($query, userId: $user_id)->data->result->success;
    }

    public function getForRecipe(string $user_id, string $recipe_id): ShoppingList
    {
        $query = <<<'GQL'
          query(
              $recipe: ID
          ){
            result:shoppingList(
                recipe: $recipe
            ){
              pageInfo{
                hasNextPage
                hasPreviousPage
              }
              edges{
                node{
                  id
                  recipeId
                  ingredient
                  quantity
                  floatQuantity
                  unit
                  recipeServings
                  numberOfServings
                }
              }
            }
          }
        GQL;
        $result = Suggestic::run($query, userId: $user_id, params: [
            'recipe' => Suggestic::ensureB64Id('Recipe', $recipe_id),
        ])->data->result;

        return ShoppingList::make((object) [
            'has_next' => $result->pageInfo->hasNextPage,
            'has_prev' => $result->pageInfo->hasPreviousPage,
            'aggregated' => false,
            'items' => collect($result->edges)
                ->map(function ($edge) {
                  return ShoppingListItem::make($edge->node);
              }),
        ]);
    }

    public function getForRecipes(string $user_id, array $recipe_ids): array
    {
        $queryGen = function ($ix) {
            return (object) [
                'p' => "recipe${ix}",
                'a' => "result${ix}",
                'pb' => "\$recipe${ix}: ID",
                'qb' => <<<GQL
            result${ix}:shoppingList(
                recipe: \$recipe${ix}
            ){
              pageInfo{
                hasNextPage
                hasPreviousPage
              }
              edges{
                node{
                  id
                  recipeId
                  ingredient
                  quantity
                  floatQuantity
                  unit
                  recipeServings
                  numberOfServings
                }
              }
            }
        GQL
            ];
        };

        $params = [];
        $paramBody = '';
        $queryBody = '';
        $aliases = [];

        foreach (array_values($recipe_ids) as $ix => $recipe_id) {
            $gen = $queryGen($ix);
            $params[$gen->p] = Suggestic::ensureB64Id('Recipe', $recipe_id);
            $aliases[] = $gen->a;
            $paramBody .= $gen->pb . "\n";
            $queryBody .= $gen->qb . "\n";
        }

        $query = <<<GQL
      query(
          ${paramBody}
      ){
        ${queryBody}
      }
    GQL;
        $results = Suggestic::run($query, userId: $user_id, params: $params)->data;

        return array_map(function ($alias) use ($results) {
            $result = $results->{$alias};
            return ShoppingList::make((object) [
                'has_next' => $result->pageInfo->hasNextPage,
                'has_prev' => $result->pageInfo->hasPreviousPage,
                'aggregated' => false,
                'items' => collect($result->edges)
                    ->map(function ($edge) {
                      return ShoppingListItem::make($edge->node);
                  }),
            ]);
        }, $aliases);
    }

    public function getForMealPlan(string $user_id): ShoppingList
    {
        $cursor = null;
        $items = [];
        while (true) {
            $query = <<<'GQL'
      query($cursor:String){
        result:shoppingListAggregate(after:$cursor){
          pageInfo{
            hasNextPage
            hasPreviousPage
            endCursor
          }
          edges{
            node{
              ingredient
              quantity
              unit
              listitemSet(
                first: 100
              ){
                edges{
                  node{
                    id
                    recipeId
                  }
                }
              }
            }
          }
        }
      }
    GQL;

            $result = Suggestic::run($query, userId: $user_id, params: [
                'cursor' => $cursor,
            ])->data->result;
            $items = array_merge($items, $result->edges);
            if (! $result->pageInfo->hasNextPage) {
                break;
            }
            $cursor = $result->pageInfo->endCursor;
        }
        return ShoppingList::make((object) [
            'has_next' => false,
            'has_prev' => false,
            'aggregated' => true,
            'items' => collect($items)
                ->map(function ($edge) {
                  return ShoppingListItem::make($edge->node);
              }),
        ]);
    }
}
