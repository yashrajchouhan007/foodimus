<?php

declare(strict_types=1);

namespace App\Repositories;

/**
 * type Coach implements Node { appointments( end: DateTime! start: DateTime! timezone: String ): [Appointment!]!
 * avatarUrl: String! id: ID! name: String! }
 *
 * type CoachConnection { edges: [CoachEdge]! pageInfo: PageInfo! }
 *
 * type CoachEdge { cursor: String! node: Coach }
 */
interface CoachRepositoryInterface
{
    /**
     * coachSet( after: String before: String first: Int last: Int offset: Int ): CoachConnection!
     */

    /**
     * myCoaches( after: String before: String first: Int id: ID last: Int offset: Int ): CoachConnection
     */
}
