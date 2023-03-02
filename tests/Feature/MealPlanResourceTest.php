<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class MealPlanResourceTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function testCreateMealplanEndpoint()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->get('/suggestic/create-mealplan/');

        $response->assertStatus(200);
    }

    public function testShowMealplanEndpoint()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->get('/suggestic/show-mealplan/');

        $response->assertStatus(200);
    }
}
