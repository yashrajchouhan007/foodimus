<?php

declare(strict_types=1);

namespace App\Services\Repositories;

use Illuminate\Support\Facades\Facade;

/**
 * MealRepository
 *
 * @method static void get($id)
 * @method static void all()
 * @method static void create(array $data)
 * @method static void delete($id)
 * @method static void update($id, array $data)
 */
class MealRepository extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'App\Repositories\MealRepositoryInterface';
    }
}
