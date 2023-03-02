<?php

declare(strict_types=1);

namespace App\Repositories;

interface UserRepositoryInterface
{
    /**
     * create a user
     */
    public function create(string $name, string $email): \App\Http\Resources\UserCreateResult;

    public function getIdByEmail(string $email): string|null;

    /**
     * delete a user
     */
    public function delete(string $id): bool;

    public function setProgram(string $user_id, string $program_id): bool;
}
