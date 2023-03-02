<?php

declare(strict_types=1);

namespace App\Models;

use App\Services\Repositories\RecipeRepository;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Recipe
 *
 * @property int $id
 * @property mixed $created_at
 * @property mixed $updated_at
 * @property string $suggestic_id
 * @property string $slug
 * @property string $story
 */
class Recipe extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['suggestic_id', 'slug', 'story'];

    public function getRemoteObject(
        bool $includeText = false,
        bool $includeNutrients = false,
        bool $includeIngredients = false,
        bool $includeSteps = false,
    ): \App\Http\Resources\Recipe {
        return Cache::remember('Suggestic-Recipe-' . $this->suggestic_id, 3600, function () {
            return RecipeRepository::get($this->suggestic_id, true, true, true, true);
        });
    }

    public function images()
    {
        return $this->hasMany(\App\Models\RecipeImage::class);
    }
}
