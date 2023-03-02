<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Recipe
 *
 * @property int $id
 * @property mixed $created_at
 * @property mixed $updated_at
 * @property string $recipe_id
 * @property string $image_id
 * @property string $image_type
 */
class RecipeImage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['recipe_id', 'image_id', 'image_type'];

    public function recipe()
    {
        return $this->belongsTo(\App\Models\Recipe::class);
    }

    public function image()
    {
        return $this->belongsTo(\App\Models\Image::class);
    }
}
