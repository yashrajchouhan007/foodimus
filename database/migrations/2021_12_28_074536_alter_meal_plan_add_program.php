<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterMealPlanAddProgram extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('meal_plan_templates', function (Blueprint $table) {
            $table->rename('programs');
        });
        Schema::table('programs', function (Blueprint $table) {
            $table->renameColumn('suggestic_id', 'suggestic_template_id');
            $table->renameIndex('suggestic_id', 'suggestic_template_id');

            $table->string('suggestic_program_id')
                ->index('suggestic_program_id')
                ->nullable(); // Temporary so the migration will work
            // TODO: add migration that removes nullable
        });
        Schema::table('user_meal_plans', function (Blueprint $table) {
            $table->renameColumn('meal_plan_template_id', 'program_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('programs', function (Blueprint $table) {
            $table->rename('meal_plan_templates');
        });
        Schema::table('meal_plan_templates', function (Blueprint $table) {
            $table->renameColumn('suggestic_template_id', 'suggestic_id');
            $table->dropColumn('suggestic_program_id');
        });
        Schema::table('user_meal_plans', function (Blueprint $table) {
            $table->renameColumn('program_id', 'meal_plan_template_id');
        });
    }
}
