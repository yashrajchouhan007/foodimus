<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUserDetails extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('user_details', function (Blueprint $table) {
            $table->string('timezone', 40)
                ->default('UTC');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('user_details', function (Blueprint $table) {
            $table->dropColumn('timezone');
        });
    }
}
