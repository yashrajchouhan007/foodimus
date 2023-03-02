<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMealPlanTemplateDetailTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('meal_plan_template_details', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('suggestic_id')
                ->unique('suggestic_id');
            $table->string('slug')
                ->unique('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('meal_plan_template_details');
    }
}
