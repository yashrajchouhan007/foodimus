<?php

declare(strict_types=1);

namespace App\Repositories\Suggestic;

use App\Helpers\Suggestic;
use App\Http\Resources\MealPlanTemplate;
use App\Http\Resources\MealPlanTemplates;
use Symfony\Polyfill\Intl\Icu\Exception\NotImplementedException;

/**
 * type MealPlanTemplate implements Node { coachId: ID createdAt: DateTime! days: [MealPlanDay!]! description: String!
 * id: ID! isPublic: Boolean! name: String! }
 */
class MealPlanTemplateRepository implements \App\Repositories\MealPlanTemplateRepositoryInterface
{
    /**
     * query mealPlanTemplates( after: String before: String byCoach: ID excludeCoach: ID first: Int isPublic: Boolean
     * last: Int newerFirst: Boolean offset: Int search: String ): MealPlanTemplateConnection
     *
     * type MealPlanTemplateConnection { edges: [MealPlanTemplateEdge]! pageInfo: PageInfo! }
     *
     * type MealPlanTemplateEdge { cursor: String! node: MealPlanTemplate }
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     * { mealPlanTemplates{ pageInfo{ hasNextPage hasPreviousPage } edges{ node{ coachId createdAt days{ calories
     * date(useDatetime: false) day id meals{ calories id maxNumOfServings meal numOfServings recipe{ id } } }
     * description id isPublic name } } } }
     */
    public function list(
        string $coachId = null,
        string $search = null,
        int $start = 0,
        int $count = 50,
        bool $includeMeals = false
    ): MealPlanTemplates {
        $daysQuery = <<<GQL
            days{
                id
                day
            }
        GQL;
        if ($includeMeals) {
            $daysQuery = <<<GQL
            days{
                id
                day
                meals{
                    id
                    calories
                    maxNumOfServings
                    meal
                    numOfServings
                    recipe{
                        serving
                        id
                        databaseId
                        cleanName
                        name
                    }
                }
            }
        GQL;
        }
        $query = <<<GQL
            query( 
                \$offset: Int,
                \$first: Int,
                \$coachId: ID,
                \$search: String,
                \$newerFirst: Boolean
            ) {
              mealPlanTemplates(
                offset: \$offset, 
                first: \$first,
                byCoach: \$coachId,
                search: \$search,
                newerFirst: \$newerFirst
              ){
                pageInfo{
                  hasNextPage
                  hasPreviousPage
                }
                edges{
                  node{
                    id
                    name
                    coachId
                    createdAt
                    description
                    isPublic
                    ${daysQuery}
                  }
                }
              }
            }
        GQL;

        $result = Suggestic::run($query, params: [
            'offset' => $start,
            'first' => $count,
            'coachId' => $coachId,
            'search' => $search,
            'newerFirst' => true,
        ])->data->mealPlanTemplates;

        return MealPlanTemplates::make([
            'has_next' => $result->pageInfo->hasNextPage,
            'has_prev' => $result->pageInfo->hasPreviousPage,
            'templates' => array_map(function ($i) {
                return $i->node;
            }, $result->edges),
        ]);
    }

    /**
     * mutation createMealPlanTemplate( coach: ID customOptions: MPTCustomOptionsInput description: String! fromDays:
     * MPTFromDaysInput fromScratch: MPTFromScratchInput isPublic: Boolean name: String! ): CreateMealPlanTemplate
     *
     * input MPTCustomOptionsInput { calories: Int carbsPerc: Int fatPerc: Int format: [MealTime!] program: ID
     * proteinPerc: Int }
     *
     * input MPTFromDaysInput { fromDate: Date! profileId: ID! toDate: Date! }
     *
     * input MPTFromScratchInput { days: [MPTFromScratchDayInput!]! }
     *
     * input MPTFromScratchDayInput { meals: [MPTFromScratchMealInput!]! }
     *
     * input MPTFromScratchMealInput { mealType: MealTime! recipeId: ID! servings: Int }
     *
     * type CreateMealPlanTemplate { mealPlan: MealPlanTemplate message: String! success: Boolean! }
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     * mutation { createMealPlanTemplate( description:"Test template", name:"Test", fromScratch:{ days:[{ meals:[{
     * mealType:BREAKFAST, recipeId:"UmVjaXBlOjY3MjQzMGVlLTMxN2ItNDNjYi04ZTgwLWZiZGQ5NzkyMDg5YQ==" servings: 2 },{
     * mealType:LUNCH, recipeId:"UmVjaXBlOmIwZDcxZWI5LTUyZjYtNDk2Ny05MDhiLTliYTVlOGNlY2M2Yg==" servings: 2 },{
     * mealType:DINNER, recipeId:"UmVjaXBlOmI0YmEzMTk2LWQwMjItNGEwZS1hMjEyLWJmMGRkYjY2MDYzMA==" servings: 2 }] },{
     * meals:[{ mealType:BREAKFAST, recipeId:"UmVjaXBlOjUwYzg1MzFmLWQyMjEtNDg4ZC1iNTFjLTFiZTk4ZTBlNGU0Yg==" servings: 2
     * },{ mealType:LUNCH, recipeId:"UmVjaXBlOjE1MjVmNjNkLTUwN2UtNDllMC1hYWFhLTRhY2U1OGMwZTFmZQ==" servings: 2 },{
     * mealType:DINNER, recipeId:"UmVjaXBlOmIzOWZmZGQ2LWJjYjQtNDgzMi1hZWMyLTkzMzg1NDFmNzg0NQ==" servings: 2 }] },] } ){
     * mealPlan{ coachId createdAt days{ calories date(useDatetime: false) day id meals{ calories id maxNumOfServings
     * meal numOfServings recipe{ id } } } description id isPublic name } message success } }
     */
    public function create(array $data): MealPlanTemplate
    {
        // TODO: Implement
        throw new NotImplementedException('Not implemented yet');
    }

    public function createFromDays(
        string $profileId,
        string $fromDate,
        string $toDate,
        string $name,
    ): MealPlanTemplate {
        $query = <<<'GQL'
        mutation(
          $profileId: ID!
          $fromDate: Date!
          $toDate: Date!
          $name: String!
        ) {
          result:createMealPlanTemplate(
            description:""
            name: $name
            fromDays: {
              fromDate: $fromDate
              toDate: $toDate
              profileId: $profileId
            }
          ) {
            success
            mealPlan{
              id
              name
              coachId
              createdAt
              description
              isPublic
            }
          }
        }
        GQL;

        $result = Suggestic::run($query, params: [
            'profileId' => Suggestic::ensureB64Id('ProfileType', $profileId),
            'fromDate' => $fromDate,
            'toDate' => $toDate,
            'name' => $name,
        ])->data;
        if (! $result->result->success) {
            throw new \Exception('Failed to create meal plan template');
        }
        return MealPlanTemplate::make($result->result->mealPlan);
    }

    /**
     * mutation deleteMealPlanTemplate(coach: ID, id: ID!): DeleteMealPlanTemplate
     *
     * type DeleteMealPlanTemplate { mealPlan: MealPlanTemplate message: String! success: Boolean! }
     */
    public function delete(string $id): bool
    {
        // TODO: Implement
        throw new NotImplementedException('Not implemented yet');
    }

    /**
     * mutation duplicateMealPlanTemplate(id: ID!): DuplicateMealPlanTemplate
     *
     * type DuplicateMealPlanTemplate { mealPlan: MealPlanTemplate message: String! success: Boolean! }
     */
    public function duplicate(string $id): MealPlanTemplate
    {
        // TODO: Implement
        throw new NotImplementedException('Not implemented yet');
    }

    /**
     * mutation updateMealPlanTemplate( coach: ID description: String id: ID! isPublic: Boolean mealPlanDays:
     * MPTFromScratchInput name: String ): UpdateMealPlanTemplate
     *
     * type UpdateMealPlanTemplate { mealPlan: MealPlanTemplate message: String! success: Boolean! }
     */
    public function update(string $id, array $data): MealPlanTemplate
    {
        // TODO: Implement
        throw new NotImplementedException('Not implemented yet');
    }

    /**
     * query mealPlanTemplate(id: ID!): MealPlanTemplate
     */
    public function get(
        string $id,
        bool $includeMeals = false,
        bool $includeRecipe = false,
        bool $includeNutrients = false
    ): MealPlanTemplate {
        $nutrientsQuery = '';
        if ($includeNutrients) {
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
        if ($includeRecipe) {
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
          serving
          ${nutrientsQuery}
        }
        GQL;
        }
        $daysQuery = '';
        if ($includeMeals) {
            $daysQuery = <<<GQL
        days{
            id
            day
            meals{
                id
                maxNumOfServings
                calories
                meal
                numOfServings
                ${recipeQuery}
            }
        }
        GQL;
        }
        $query = <<<GQL
            query( 
                \$id: ID!,
            ) {
              mealPlanTemplate(
                id: \$id, 
              ){
                coachId
                createdAt
                description
                id
                isPublic
                name
                ${daysQuery}
              }
            }
        GQL;

        $result = Suggestic::run($query, params: [
            'id' => Suggestic::ensureB64Id('MealPlanTemplate', $id),
        ])->data;
        return MealPlanTemplate::make($result->mealPlanTemplate);
    }

    /**
     * mutation setMealPlanToTemplate(profileId: ID!, templateId: ID!): SetMealPlanToTemplate type SetMealPlanToTemplate
     * { message: String! success: Boolean! }
     *
     * mutation { setMealPlanToTemplate( profileId:"UHJvZmlsZVR5cGU6M2VlYjI4MWMtZWNjMS00YmEwLTljNDEtNTIwMWQ2ODVjMGJj",
     * templateId:"TWVhbFBsYW5UZW1wbGF0ZTpmMzM3NTc5MC1jOTZkLTQzNjktYjg4Ni04MDBkZTNhYjkwOTU=" ){ success } } NOTE: You
     * can't get the profileId from the myProfile or searchProfile queries You need to use the base64 encoded version of
     * `ProfileType:{profile id}` I.e.: the above value is base64("ProfileType:3eeb281c-ecc1-4ba0-9c41-5201d685c0bc")
     *
     * Use Suggestic::getId to generate it
     */
    public function activate(string $profileId, string $templateId,): bool
    {
        $query = <<<'GQL'
          mutation(
            $profileId: ID!,
            $templateId: ID!,
          ) {
            setMealPlanToTemplate(
              profileId: $profileId,
              templateId: $templateId
            ){
              success
            }
          }
        GQL;

        $result = Suggestic::run($query, params: [
            'profileId' => Suggestic::ensureB64Id('ProfileType', $profileId),
            'templateId' => Suggestic::ensureB64Id('MealPlanTemplate', $templateId),
        ])->data;
        return $result->setMealPlanToTemplate->success;
    }
}
