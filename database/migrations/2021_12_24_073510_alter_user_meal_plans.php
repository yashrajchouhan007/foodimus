<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUserMealPlans extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('user_meal_plans', function (Blueprint $table) {
            $table->dateTime('plan_start')
                ->nullable();
            $table->dateTime('plan_end')
                ->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('user_meal_plans', function (Blueprint $table) {
            $table->dropColumn('plan_start');
            $table->dropColumn('plan_end');
        });
    }
}
