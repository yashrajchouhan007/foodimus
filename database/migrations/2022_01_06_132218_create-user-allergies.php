<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserAllergies extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('user_allergies', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignIdFor(\App\Models\User::class)->index();
            $table->foreignIdFor(\App\Models\Allergy::class);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('user_allergies');
    }
}
