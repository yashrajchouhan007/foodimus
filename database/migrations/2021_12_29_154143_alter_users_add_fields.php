<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUsersAddFields extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignIdFor(\App\Models\Avatar::class, 'avatar_id')
                ->nullable();
            $table->string('phone')
                ->after('date_of_birth')
                ->nullable();
            $table->string('street')
                ->after('phone')
                ->nullable();
            $table->string('house_number')
                ->after('street')
                ->nullable();
            $table->string('zip_code')
                ->after('house_number')
                ->nullable();
            $table->string('city')
                ->after('zip_code')
                ->nullable();
            $table->string('country')
                ->after('city')
                ->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('avatar_id');
            $table->dropColumn('phone');
            $table->dropColumn('street');
            $table->dropColumn('house_number');
            $table->dropColumn('zip_code');
            $table->dropColumn('city');
            $table->dropColumn('country');
        });
    }
}
