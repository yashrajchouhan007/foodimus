<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterKeys extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('meal_plan_template_details', function (Blueprint $table) {
            $table->renameColumn('hero_image', 'hero_image_id');
            $table->renameColumn('header_image', 'header_image_id');
            $table->renameColumn('influencer', 'influencer_id');
        });
        Schema::table('influencers', function (Blueprint $table) {
            $table->renameColumn('hero_image', 'hero_image_id');
            $table->renameColumn('header_image', 'header_image_id');
            $table->renameColumn('avatar', 'avatar_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('influencers', function (Blueprint $table) {
            $table->renameColumn('hero_image_id', 'hero_image');
            $table->renameColumn('header_image_id', 'header_image');
            $table->renameColumn('avatar_id', 'avatar');
        });
        Schema::table('meal_plan_template_details', function (Blueprint $table) {
            $table->renameColumn('hero_image_id', 'hero_image');
            $table->renameColumn('header_image_id', 'header_image');
            $table->renameColumn('influencer_id', 'influencer');
        });
    }
}
