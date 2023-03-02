<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class DeletePlansTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::dropIfExists('plans');
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        //
    }
}
