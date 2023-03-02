<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        \App\Models\Program::factory()->createMany(
            [
                [
                    'id' => 1,
                    'created_at' => '2021-12-22 10:51:22',
                    'updated_at' => '2021-12-22 13:36:31',
                    'suggestic_template_id' => '939ba9f4-4547-4cc5-83f6-b02ceb7d46e4',
                    'slug' => 'meal-plan-for-weight-loss',
                    'published' => 1,
                    'story' => "# Wat staat je te wachten\n\nDe week is opgebouwd uit lichte maaltijden, gevolgd door dagen waarop je alleen smoothies en soepen eet. Vervolgens ga je verder met drie dagen smoothies en soepen. De detoxweek geef je een extra boost door twee dagen alleen sappen te drinken. Daarna bouw je weer op met lichtte maaltijden. Begin elke dag met een groot glas water drinken, eventueel met het sap van ½ - 1 citroen. De sap dagen start je met een glas bleekselderij sap. Bleekselderijsap heeft een enorm reinigend effect op het lichaam, ondersteunt de lever en helpt om alles wat je daarna eet beter te kunnen verteren. Ready to feel clean, green, lean and full of energy?\n\n**Dan is deze week voor jou!**",
                    'name' => 'Meal Plan for Weight Loss',
                    'total_days' => '7',
                    'hero_image_id' => 1,
                    'header_image_id' => 2,
                    'influencer_id' => 2,
                    'suggestic_program_id' => 'fc7586e7-8131-4b3b-a848-2ecb65555705',
                    'featured' => 1,
                ],
                [
                    'id' => 2,
                    'created_at' => '2021-12-22 10:51:22',
                    'updated_at' => '2021-12-22 13:36:31',
                    'suggestic_template_id' => 'f3375790-c96d-4369-b886-800de3ab9095',
                    'slug' => 'detox-week-plus',
                    'published' => 1,
                    'story' => "# Wat staat je te wachten\n\nDe week is opgebouwd uit lichte maaltijden, gevolgd door dagen waarop je alleen smoothies en soepen eet. Vervolgens ga je verder met drie dagen smoothies en soepen. De detoxweek geef je een extra boost door twee dagen alleen sappen te drinken. Daarna bouw je weer op met lichtte maaltijden. Begin elke dag met een groot glas water drinken, eventueel met het sap van ½ - 1 citroen. De sap dagen start je met een glas bleekselderij sap. Bleekselderijsap heeft een enorm reinigend effect op het lichaam, ondersteunt de lever en helpt om alles wat je daarna eet beter te kunnen verteren. Ready to feel clean, green, lean and full of energy?\n\n**Dan is deze week voor jou!**",
                    'name' => 'Detox Week Plus',
                    'total_days' => '7',
                    'hero_image_id' => 3,
                    'header_image_id' => 4,
                    'influencer_id' => 2,
                    'suggestic_program_id' => '863d5e79-f755-42b1-913b-5ef735216039',
                ],
            ]
        );
    }
}
