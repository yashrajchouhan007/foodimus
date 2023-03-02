<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RecreateUserMealPlans extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::dropIfExists('user_meal_plans');
        Schema::create('user_meal_plans', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignIdFor(App\Models\User::class, 'user_id');

            //TODO: change to match new model name Programs
            $table->foreignIdFor(App\Models\Program::class, 'meal_plan_template_id');

            $table->index(['user_id', 'id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('user_meal_plans');
        Schema::create('user_meal_plans', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('user_id');
            $table->string('template_suggestic_id');

            $table->index(['user_id', 'id']);
        });
    }
}
