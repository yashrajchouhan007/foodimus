<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Image
 *
 * @property mixed $id
 * @property mixed $created_at
 * @property mixed $updated_at
 * @property mixed $src
 * @property mixed $fs
 * @property mixed $path
 * @property mixed $focus_x
 * @property mixed $focus_y
 * @property mixed $description
 */
class Image extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['src', 'focus_x', 'focus_y', 'description'];

    public function toArray()
    {
        return [
            'src' => $this->src,
            'focus' => [$this->focus_x, $this->focus_y],
        ];
    }
}
