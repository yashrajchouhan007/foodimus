<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserDetailsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('user_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->nullable();
            $table->tinyInteger('apply_goals')
                ->nullable();
            $table->smallInteger('unit_type')
                ->nullable();
            $table->decimal('height')
                ->nullable();
            $table->decimal('weight')
                ->nullable();
            $table->decimal('target_weight')
                ->nullable();
            $table->string('activity_level')
                ->nullable();
            $table->string('weekly_goal')
                ->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('user_details');
    }
}
