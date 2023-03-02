<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterForInfluencerPage extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('influencers', function (Blueprint $table) {

            //full_name
            //short_name
            //slug
            //avatar
            //hero_image_id
            //header_image_id
            //overlay_image_id
            $table->boolean('published')
                ->default(false);
            $table->longText('header_box_text_mobile')
                ->nullable();
            $table->longText('header_box_text_desktop')
                ->nullable();
            $table->string('header_color', 20)
                ->nullable();
            $table->string('logo_color', 20)
                ->nullable();
            $table->string('header_box_button_color', 20)
                ->nullable();
            $table->string('header_box_button_text', 20)
                ->nullable();
            $table->string('title')
                ->nullable();
            $table->longText('story')
                ->nullable();
            $table->string('instagram_url')
                ->nullable();
            $table->string('facebook_url')
                ->nullable();
            $table->foreignIdFor(\App\Models\Image::class, 'signature_image_id')
                ->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('influencers', function (Blueprint $table) {
            $table->dropColumn('published');
            $table->dropColumn('header_box_text_mobile');
            $table->dropColumn('header_box_text_desktop');
            $table->dropColumn('header_color');
            $table->dropColumn('logo_color');
            $table->dropColumn('header_box_button_color');
            $table->dropColumn('header_box_button_text');
            $table->dropColumn('story');
            $table->dropColumn('instagram_url');
            $table->dropColumn('facebook_url');
            $table->dropColumn('signature_image_id');
        });
    }
}
