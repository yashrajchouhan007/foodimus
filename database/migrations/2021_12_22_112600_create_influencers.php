<?php

declare(strict_types=1);

use App\Models\Avatar;
use App\Models\Image;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInfluencers extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('influencers', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('full_name');
            $table->string('short_name');
            $table->string('slug');
            $table->foreignIdFor(Avatar::class, 'avatar');
            $table->foreignIdFor(Image::class, 'hero_image')->nullable();
            $table->foreignIdFor(Image::class, 'header_image')->nullable();
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('influencers');
    }
}
