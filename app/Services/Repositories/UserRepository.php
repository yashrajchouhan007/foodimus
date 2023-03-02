<?php

declare(strict_types=1);

namespace App\Services\Repositories;

use Illuminate\Support\Facades\Facade;

/**
 * UserRepository
 *
 * @method static \App\Http\Resources\UserCreateResult create(string $name, string $email)
 * @method static string|null getIdByEmail(string $email)
 * @method static bool delete(string $id)
 * @method static bool setProgram(string $user_id, string $program_id)
 */
class UserRepository extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'App\Repositories\UserRepositoryInterface';
    }
}
