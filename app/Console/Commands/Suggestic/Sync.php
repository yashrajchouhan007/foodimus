<?php

declare(strict_types=1);

namespace App\Console\Commands\Suggestic;

use App\Helpers\Arrays;
use App\Helpers\Slugify;
use App\Helpers\Suggestic;
use App\Helpers\UniqueKey;
use App\Models\Avatar;
use App\Models\Image;
use App\Models\Influencer;
use App\Models\Recipe;
use App\Repositories\MealPlanTemplateRepositoryInterface;
use Illuminate\Console\Command;

class Sync extends Command
{
    protected MealPlanTemplateRepositoryInterface $templates;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'suggestic:sync {--include-content}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync data from Suggestic';

    /**
     * Create a new command instance.
     */
    public function __construct(MealPlanTemplateRepositoryInterface $templates)
    {
        parent::__construct();
        $this->templates = $templates;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $include_content = $this->option('include-content');

        $start = 0;
        $count = 100;
        $hasNext = true;
        do {
            $result = $this->templates->list(start: $start, count: $count, includeMeals: true);
            error_log('Fetched ' . count($result['templates']) . ' meal plan templates');

            list($templateSlugs, $recipeSlugs) = self::findSlugs($result['templates']);

            self::updateTemplateSlugs($templateSlugs);
            self::updateRecipeSlugs($recipeSlugs);
            if ($include_content) {
                self::updateTemplateContent($result['templates']);
            }
            $hasNext = $result['has_next'];
            $start += $count;
        } while ($hasNext);
        return 0;
    }

    private static function updateTemplateContent(array $templates)
    {
        error_log('checking template content');
        $indexed = Arrays::byKey($templates, function ($i) {
            return Suggestic::ensureDbId('MealPlanTemplate', $i->id);
        });
        $items = \App\Models\Program::whereIn('suggestic_template_id', array_keys($indexed))->get();

        foreach ($items as $item) {
            /** @var \App\Models\Program $item */
            /** @var \App\Http\Resources\MealPlanTemplate $template */
            $template = $indexed[$item->suggestic_template_id];

            $item->name = $template->name;
            $item->total_days = 7; //count($template->days);
            $item->published = true;

            $data = json_decode($template->description);

            if ($data) {
                if (isset($data->story) && $data->story) {
                    $item->story = $data->story;
                }
                if (isset($data->influencer) && $data->influencer) {
                    $influencer = Influencer::whereSlug($data->influencer->slug)->first();
                    if ($influencer === null) {
                        $influencer = Influencer::create([
                            'short_name' => $data->influencer->shortName,
                            'full_name' => $data->influencer->name,
                            'slug' => $data->influencer->slug,
                            'avatar' => Avatar::create([
                                'src' => $data->influencer->avatar->src,
                                'orientation' => $data->influencer->avatar->orientation,
                            ])->id,
                        ]);
                    }
                    $item->influencer_id = $influencer->id;
                }
                if (isset($data->heroImg) && $data->heroImg && ! $item->hero_image_id) {
                    $item->hero_image_id = Image::create([
                        'src' => $data->heroImg->src,
                        'focus_x' => $data->heroImg->focus[0],
                        'focus_y' => $data->heroImg->focus[1],
                    ])->id;
                }
                if (isset($data->headerImg) && $data->headerImg && ! $item->header_image_id) {
                    $item->header_image_id = Image::create([
                        'src' => $data->headerImg->src,
                        'focus_x' => $data->headerImg->focus[0],
                        'focus_y' => $data->headerImg->focus[1],
                    ])->id;
                }
            }
            if ($item->isDirty()) {
                error_log('updating template content');
                $item->save();
            }
        }
    }

    private static function findSlugs(array $templates)
    {
        $templateSlugs = [];
        $recipeSlugs = [];

        foreach ($templates as $template) {
            $templateId = Suggestic::ensureDbId('MealPlanTemplate', $template->id);
            $templateSlug = UniqueKey::get($templateSlugs, Slugify::slugify($template->name));
            $templateSlugs[$templateSlug] = $templateId;

            foreach ($template->days as $day) {
                foreach ($day->meals as $meal) {
                    $recipe = $meal->recipe;
                    $recipeId = Suggestic::ensureDbId('Recipe', $recipe->id);
                    $recipeSlug = UniqueKey::get(
                        $recipeSlugs,
                        Slugify::slugify($recipe->name),
                        check: function ($array, $key) use ($recipeId) {
                            if (! isset($array[$key])) {
                                return true;
                            }
                            return $array[$key] === $recipeId;
                        }
                    );
                    $recipeSlugs[$recipeSlug] = $recipeId;
                }
            }
        }

        return [$templateSlugs, $recipeSlugs];
    }

    private static function updateTemplateSlugs(array $templates)
    {
        $items = \App\Models\Program::query()
            ->whereIn('suggestic_template_id', array_values($templates), 'or')
            ->whereIn('slug', array_keys($templates), 'or')
            ->get();
        foreach ($templates as $slug => $id) {
            $item = Arrays::search($items, function ($v) use ($slug, $id) {
                return $v['slug'] === $slug || $v['suggestic_template_id'] === $id;
            });
            if ($item === null) {
                $item = new \App\Models\Program();
            }
            $item->suggestic_template_id = $id;
            $item->slug = $slug;
            if ($item->isDirty()) {
                error_log('saving');
                $item->save();
            }
        }
    }

    private static function updateRecipeSlugs(array $recipes)
    {
        $items = Recipe::query()
            ->whereIn('suggestic_id', array_values($recipes), 'or')
            ->whereIn('slug', array_keys($recipes), 'or')
            ->get();
        foreach ($recipes as $slug => $id) {
            $item = Arrays::search($items, function ($v) use ($slug, $id) {
                return $v['slug'] === $slug || $v['suggestic_id'] === $id;
            });
            if ($item === null) {
                $item = new Recipe();
            }
            $item->suggestic_id = $id;
            $item->slug = $slug;
            if ($item->isDirty()) {
                error_log('saving');
                $item->save();
            }
        }
    }
}
