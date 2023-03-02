<?php

declare(strict_types=1);

namespace App\Models;

use App\Services\Repositories\MealPlanTemplateRepository;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Program
 *
 * @property mixed $id
 * @property mixed $created_at
 * @property mixed $updated_at
 * @property mixed $suggestic_template_id
 * @property mixed $suggestic_program_id
 * @property mixed $slug
 * @property mixed $published
 * @property mixed $featured
 * @property mixed $story
 * @property mixed $name
 * @property mixed $total_days
 * @property mixed $hero_image_id
 * @property mixed $header_image_id
 * @property mixed $influencer_id
 *
 * @property \App\Models\Image $heroImage
 * @property \App\Models\Image $headerImage
 * @property \App\Models\Influencer $influencer
 */
class Program extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'suggestic_template_id',
        'suggestic_program_id',
        'slug',
        'published',
        'featured',
        'story',
        'name',
        'total_days',
        'hero_image_id',
        'header_image_id',
        'influencer_id',
    ];

    public function heroImage()
    {
        return $this->belongsTo(\App\Models\Image::class, 'hero_image_id', 'id');
    }

    public function headerImage()
    {
        return $this->belongsTo(\App\Models\Image::class, 'header_image_id', 'id');
    }

    public function influencer()
    {
        return $this->belongsTo(\App\Models\Influencer::class);
    }

    public function toArray($heroImage = true, $influencer = true,)
    {
        return [
            'slug' => $this->slug,
            'heroImg' => $heroImage ? $this->heroImage : null,
            'ambassador' => $influencer ? $this->influencer : null,
            'title' => $this->name,
            'totalDays' => $this->total_days,
        ];
    }

    public function getRemoteObject(
        bool $includeMeals = false,
        bool $includeRecipe = false,
        bool $includeNutrients = false
    ): \App\Http\Resources\MealPlanTemplate {
        return Cache::remember('Suggestic-MPT-' . $this->suggestic_template_id, 3600, function () {
            return MealPlanTemplateRepository::get($this->suggestic_template_id, true, true, true);
        });
    }
}
