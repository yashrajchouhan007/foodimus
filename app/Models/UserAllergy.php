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
 * @property string $user_id
 * @property string $allergy_id
 */
class UserAllergy extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['user_id', 'allergy_id'];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function allergy()
    {
        return $this->belongsTo(\App\Models\Allergy::class);
    }
}
