<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class InfluencerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        \App\Models\Influencer::factory()->create([
            'id' => 2,
            'created_at' => '2021-12-22 12:51:11',
            'updated_at' => '2021-12-22 12:51:11',
            'full_name' => 'Tessa Moorman',
            'short_name' => 'Tessa',
            'slug' => 'tessa-moorman',
            'avatar_id' => 2,
            'hero_image_id' => 8,
            'header_image_id' => null,
            'overlay_image_id' => 6,
            'published' => 1,
            'header_box_text_mobile' => "# Eat like :purple[Tessa]\nPlant-based recipes and a healthy lifestyle - Orthomoleculair nutritionist\n- More than 10 years experience\n - Personal guidance throughout your meal plan period!",
            'header_box_text_desktop' => "# Eat like:br[]:purple[Tessa Moorman]\nPlant-based recipes and a healthy lifestyle - Orthomoleculair nutritionist\n- More than 10 years experience\n- Personal guidance throughout your meal plan period!",
            'header_color' => 'pink',
            'logo_color' => 'purple',
            'header_box_button_color' => 'green',
            'header_box_button_text' => 'Start today!',
            'title' => 'Orthomoleculair nutristionist',
            'story' => "We willen je inspireren om bewuster te eten en je daardoor energieker, stralender en sexier te voelen! Wij geloven in elke vezel van ons lijf dat je, je leven ten goede kunt veranderen! Juist nu is het tijd om positief te zijn en die verandering door te voeren. Een plantaardig dieet zal je niet alleen gelukkiger maken, maar tegelijkertijd een positieve invloed hebben op je omgeving, het dierenwelzijn, het milieu en de planeet!\n- 68.8k Instagram followers\n- More then 100.000 books sold in The Netherlands & Belgium\n- Energized, brighter and sexier with our weekly menu’s'\n\n**Onze voedingsschema’s kunnen je daarbij helpen! Bekijk ze en verspreid de liefde!**",
            'instagram_url' => 'http://instagram.com',
            'facebook_url' => 'http://facebook.com',
            'signature_image_id' => 7,
        ]);
    }
}
