<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Avatar
 *
 * @property mixed $id
 * @property mixed $created_at
 * @property mixed $updated_at
 * @property mixed $src
 * @property mixed $fs
 * @property mixed $path
 * @property mixed $orientation
 */
class Avatar extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['src', 'fs', 'path', 'orientation', 'description'];

    public function toArray()
    {
        return [
            'src' => $this->src,
            'orientation' => $this->orientation,
        ];
    }
}
