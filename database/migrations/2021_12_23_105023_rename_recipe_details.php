<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameRecipeDetails extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('recipe_details', function (Blueprint $table) {
            $table->rename('recipes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('recipes', function (Blueprint $table) {
            $table->rename('recipe_details');
        });
    }
}
