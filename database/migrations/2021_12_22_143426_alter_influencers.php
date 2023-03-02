<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterInfluencers extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('influencers', function (Blueprint $table) {
            $table->foreignIdFor(\App\Models\Image::class, 'overlay_image_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('influencers', function (Blueprint $table) {
            $table->dropColumn('overlay_image_id');
        });
    }
}
