<?php

declare(strict_types=1);

namespace App\Repositories\Suggestic;

use App\Helpers\Suggestic;
use App\Http\Resources\UserCreateResult;

class UserRepository implements \App\Repositories\UserRepositoryInterface
{
    /**
     * create a user
     *
     * @param  mixed $name
     * @param  mixed $email
     */
    public function create(string $name, string $email): UserCreateResult
    {
        $query = <<<'GQL'
            mutation(
                $name: String!,
                $email: String!
            ) {
                createUser(
                    name: $name,
                    email: $email,
                    emailPasswordNotification: false
                ) {
                    success
                    message
                    user {
                        id
                        databaseId
                    }
                }
            }
        GQL;

        $response = Suggestic::run($query, params: [
            'name' => $name,
            'email' => $email,
        ])->data->createUser;

        return UserCreateResult::make($response);
    }

    public function getIdByEmail(string $email): string|null
    {
        $query = <<<'GQL'
          query(
              $email: String!
          ){
            result:searchProfile(
                email:$email
            ){
              userId
            }
          }
        GQL;
        try {
            $response = Suggestic::run(
                $query,
                params: [
                    'email' => $email,
                ],
                log_error: false // an error is expected if the profile doesn't exist
            )->data->result;

            return $response->userId;
        } catch (\Error) {
            return null;
        }
    }

    /**
     * delete a user
     *
     * @param  mixed $id
     */
    public function delete(string $id): bool
    {
        $query = <<<'GQL'
            mutation {
                deleteMyProfile {
                    success
                }
            }
        GQL;

        $response = Suggestic::run($query, userId: $id)->data->deleteMyProfile;

        return $response->success;
    }

    public function setProgram(string $user_id, string $program_id): bool
    {
        $query = <<<'GQL'
            mutation(
                $programId: String!
            ) {
                result:updateUserProgram(
                    programId: $programId
                ) {
                    success
                }
            }
        GQL;

        $response = Suggestic::run($query, userId: $user_id, params: [
            'programId' => Suggestic::ensureB64Id('Program', $program_id),
        ])->data->result;

        return $response->success;
    }
}
