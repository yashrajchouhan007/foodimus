<?php

declare(strict_types=1);

namespace App\Services\Repositories;

use Illuminate\Support\Facades\Facade;

/**
 * ProgramRepository
 *
 * @method statis \App\Http\Resources\Program get(string $id)
 * @method statis \App\Http\Resources\Programs list(int $start = 0, int $count = 50)
 */
class ProgramRepository extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'App\Repositories\ProgramRepositoryInterface';
    }
}
