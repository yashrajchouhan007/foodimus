<?php

declare(strict_types=1);

namespace App\Console\Commands\Suggestic;

use App\Helpers\Slugify;
use App\Helpers\Suggestic;
use App\Models\Image;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SyncPrograms extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'suggestic:sync-programs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync programs from Suggestic';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $items = [];
        $has_more = true;
        while ($has_more) {
            $result = \App\Services\Repositories\ProgramRepository::list(0, 50);
            $items = array_merge($items, $result['programs']);
            $has_more = $result['has_next'];
        }

        $itms = collect($items);
        $all_ids = $itms->map(function ($i) {
            return $i->databaseId;
        })->toArray();

        $existing = \App\Models\Program::whereIn('suggestic_program_id', $all_ids)
            ->select('suggestic_program_id')
            ->get()
            ->map(function ($i) {
                return $i['suggestic_program_id'];
            })
            ->toArray();

        $add_items = $itms->filter(function ($i) use ($existing) {
            return ! in_array($i->databaseId, $existing, true);
        });

        $dev_user = 'ad12fa6c-838c-44b9-b388-1ed75eb3035b';

        foreach ($add_items as $item) {
            /** @var \App\Http\Resources\Program $item */

            $profile_id = \App\Services\Repositories\ProfileRepository::getStub($dev_user)->id;

            if (! \App\Services\Repositories\UserRepository::setProgram($dev_user, $item->databaseId)) {
                throw new \Exception('Failed to apply program');
            }

            if (! \App\Services\Repositories\MealPlanRepository::clear($dev_user)) {
                throw new \Exception('Failed to clear meal plan');
            }

            if (! \App\Services\Repositories\MealPlanRepository::generate($dev_user)) {
                throw new \Exception('Failed to generate meal plan');
            }

            $template = \App\Services\Repositories\MealPlanTemplateRepository::createFromDays(
                $profile_id,
                Carbon::now()->toDateString(),
                Carbon::now()->addDays(7)->toDateString(),
                $item->name
            );
            $influencer = \App\Models\Influencer::whereFullName($item->author)->first();

            \App\Models\Program::create([
                'slug' => Slugify::slugify($item->name),
                'published' => 0,
                'story' => $item->descriptionLong,
                'name' => $item->name,
                'total_days' => '7',
                'influencer_id' => $influencer !== null ? $influencer->id : null,
                'suggestic_template_id' => Suggestic::ensureDbId('MealPlanTemplate', $template->id),
                'suggestic_program_id' => $item->databaseId,
                'featured' => 0,
                //'hero_image_id' => 1,
                //'header_image_id' => 2,
            ]);

            error_log('Imported ' . $item->name);
        }

        //error_log(var_export($add_items->toArray(), true));
    }
}
