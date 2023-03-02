<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterImagesAvatarsAddPath extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('images', function (Blueprint $table) {
            $table->string('fs')
                ->after('src')
                ->nullable();
            $table->string('path')
                ->after('fs')
                ->nullable();
        });
        Schema::table('avatars', function (Blueprint $table) {
            $table->string('fs')
                ->after('src')
                ->nullable();
            $table->string('path')
                ->after('fs')
                ->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('images', function (Blueprint $table) {
            $table->dropColumn('path');
            $table->dropColumn('fs');
        });
        Schema::table('avatars', function (Blueprint $table) {
            $table->dropColumn('path');
            $table->dropColumn('fs');
        });
    }
}
