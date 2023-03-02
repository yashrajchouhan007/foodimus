<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterImagesAddDescription extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('images', function (Blueprint $table) {
            $table->string('description')
                ->after('path')
                ->nullable();
        });
        Schema::table('avatars', function (Blueprint $table) {
            $table->string('description')
                ->after('path')
                ->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('images', function (Blueprint $table) {
            $table->dropColumn('description');
        });
        Schema::table('avatars', function (Blueprint $table) {
            $table->dropColumn('description');
        });
    }
}
