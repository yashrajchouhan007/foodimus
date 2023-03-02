<?php

declare(strict_types=1);

namespace App\Repositories\Suggestic;

use App\Helpers\Suggestic;
use App\Http\Resources\Meal;
use App\Http\Resources\Program;
use App\Http\Resources\Programs;
use Symfony\Polyfill\Intl\Icu\Exception\MethodNotImplementedException;

class ProgramRepository implements \App\Repositories\ProgramRepositoryInterface
{
    /**
     * Get's a meal plan by it's ID
     *
     * @param int $id
     */
    public function get($id): Program
    {
        /**
         * program(id: ID!): Program
         */
        throw new MethodNotImplementedException('');
    }

    /**
     * Get a list of programs.
     */
    public function list($start = 0, $count = 50): Programs
    {
        /*
                 *
                 * programs(
                 *   after: String
                 *   before: String
                 *   first: Int
                 *   isActive: Boolean
                 *   isPremium: Boolean
                 *   last: Int
                 *   offset: Int
                 *   orderBy: ProgramOrderBy
                 * ): ProgramConnection
                 */
        $query = <<<'GQL'
        query( 
          $offset: Int,
          $first: Int
        ) {
          programs(
            offset: $offset, 
            first: $first
          ) {
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
            edges {
              node {
                databaseId
                name
                descriptionShort
                descriptionLong
                author
                isActive
                image
                cover
                backgroundImage
              }
            }
          }
        }
        GQL;
        $result = Suggestic::run($query, params: [
            'offset' => $start,
            'first' => $count,
        ])->data->programs;
        return Programs::make([
            'has_next' => $result->pageInfo->hasNextPage,
            'has_prev' => $result->pageInfo->hasPreviousPage,
            'programs' => array_map(function ($i) {
                return $i->node;
            }, $result->edges),
        ]);
    }
}
