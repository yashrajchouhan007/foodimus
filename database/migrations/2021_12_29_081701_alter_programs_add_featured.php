<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterProgramsAddFeatured extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('programs', function (Blueprint $table) {
            $table->boolean('featured')
                ->default(false);
            $table->index(['influencer_id', 'featured', 'id'], 'influencer_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('programs', function (Blueprint $table) {
            $table->dropIndex('influencer_featured');
            $table->dropColumn('featured');
        });
    }
}
