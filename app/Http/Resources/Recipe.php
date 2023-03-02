<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Helpers\Slugify;
use App\Helpers\UniqueKey;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

/**
 * Recipe
 *
 * @property string $id
 * @property string $databaseId
 * @property string $cleanName
 * @property string $name
 * @property string $mainImage
 * @property string $squareImage
 * @property string $totalTimeInSeconds
 * @property string $recipeType
 * @property string $text
 * @property int $rating
 * @property int $serving
 * @property NutrientsPerServing $nutrientsPerServing
 * @property array $ingredients
 * @property array $ingredientLines
 * @property array $instructions
 */
class Recipe extends JsonResource
{
    public static function ensureLocal(Collection $remotes): bool
    {
        $ids = $remotes->map(function ($recipe) {
            /** @var Recipe $recipe */
            return $recipe->databaseId;
        });

        /** @var Collection $known */
        $known = \App\Models\Recipe::select('suggestic_id')
            ->whereIn('suggestic_id', $ids)
            ->get()
            ->map(function ($i) {
                return $i->suggestic_id;
            });

        $missing = $remotes->unique(function ($recipe) {
            /** @var Recipe $recipe */
            return $recipe->databaseId;
        })->filter(function ($recipe) use ($known) {
            /** @var Recipe $recipe */
            return ! $known->contains($recipe->databaseId);
        })->values();

        // TODO: can we make this more efficient?

        $slugs = \App\Models\Recipe::select('slug')->get()->map(function ($i) {
            return $i->slug;
        });

        foreach ($missing as $recipe) {
            /** @var Recipe $recipe */
            $slug = UniqueKey::get(
                $slugs,
                Slugify::slugify($recipe->name),
                check: function ($collection, $key) {
                    /** @var collection $collection */
                    return ! $collection->contains($key);
                }
            );
            $local = \App\Models\Recipe::create([
                'suggestic_id' => $recipe->databaseId,
                'slug' => $slug,
                'story' => $recipe->text ?? '',
            ]);
            if ($recipe->mainImage) {
                $img = \App\Models\Image::create([
                    'src' => $recipe->mainImage,
                    'description' => "{$recipe->name} main image",
                ]);
                \App\Models\RecipeImage::create([
                    'image_id' => $img->id,
                    'recipe_id' => $local->id,
                    'image_type' => 'hero',
                ]);
            }
            if ($recipe->squareImage) {
                $img = \App\Models\Image::create([
                    'src' => $recipe->squareImage,
                    'description' => "{$recipe->name} square image",
                ]);
                \App\Models\RecipeImage::create([
                    'image_id' => $img->id,
                    'recipe_id' => $local->id,
                    'image_type' => 'square',
                ]);
            }
        }
        return true;
    }
}
