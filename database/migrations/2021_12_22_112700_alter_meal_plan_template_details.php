<?php

declare(strict_types=1);

use App\Models\Image;
use App\Models\Influencer;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterMealPlanTemplateDetails extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('meal_plan_template_details', function (Blueprint $table) {
            $table->boolean('published')
                ->default(false);
            $table->longText('story')
                ->nullable();
            $table->string('name')
                ->nullable();
            $table->string('total_days')
                ->nullable();
            $table->foreignIdFor(Image::class, 'hero_image')->nullable();
            $table->foreignIdFor(Image::class, 'header_image')->nullable();
            $table->foreignIdFor(Influencer::class, 'influencer')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('meal_plan_template_details', function (Blueprint $table) {
            $table->dropColumn('published');
            $table->dropColumn('story');
            $table->dropColumn('hero_image');
            $table->dropColumn('header_image');
            $table->dropColumn('influencer');
            $table->dropColumn('name');
            $table->dropColumn('total_days');
        });
    }
}
