<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * UserMealPlan
 *
 * @property mixed $id
 * @property mixed $created_at
 * @property mixed $updated_at
 * @property mixed $user_id
 * @property mixed $program_id
 * @property mixed $plan_start
 * @property mixed $plan_end
 */
class UserMealPlan extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['user_id', 'program_id', 'plan_start', 'plan_end'];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function program()
    {
        return $this->belongsTo(\App\Models\Program::class);
    }
}
