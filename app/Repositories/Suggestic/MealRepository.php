<?php

declare(strict_types=1);

namespace App\Repositories\Suggestic;

class MealRepository implements \App\Repositories\MealRepositoryInterface
{
    /**
     * Get's a meal plan by it's ID
     *
     * @param int $id
     */
    public function get($id)
    {
        // TODO: Implement get() method
    }

    /**
     * Get's all meals.
     *
     * @return mixed
     */
    public function all()
    {
    }

    /**
     * create a meal.
     */
    public function create(array $data)
    {
    }

    /**
     * Updates a meal.
     *
     * @param int $id
     */
    public function update($id, array $data)
    {
    }

    /**
     * Deletes a meal.
     *
     * @param int $id
     */
    public function delete($id)
    {
    }
}
