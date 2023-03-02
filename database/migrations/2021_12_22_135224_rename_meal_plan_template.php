<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameMealPlanTemplate extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('meal_plan_template_details', function (Blueprint $table) {
            $table->rename('meal_plan_templates');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('meal_plan_templates', function (Blueprint $table) {
            $table->rename('meal_plan_template_details');
        });
    }
}
