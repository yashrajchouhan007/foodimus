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
 * @property mixed $slug
 * @property mixed $name
 * @property mixed $suggestic_id
 */
class Allergy extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['slug', 'name', 'suggestic_id'];

    public function toArray()
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
        ];
    }
}
