<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Influencer
 *
 * @property mixed $id
 * @property mixed $created_at
 * @property mixed $updated_at
 * @property mixed $published
 * @property mixed $full_name
 * @property mixed $short_name
 * @property mixed $slug
 * @property mixed $avatar_id
 * @property mixed $hero_image_id
 * @property mixed $header_image_id
 * @property mixed $overlay_image_id
 *
 * @property mixed $title
 * @property mixed $header_box_text_mobile
 * @property mixed $header_box_text_desktop
 * @property mixed $header_color
 * @property mixed $logo_color
 * @property mixed $button_color
 * @property mixed $button_text
 * @property mixed $story
 * @property mixed $instagram_url
 * @property mixed $facebook_url
 * @property mixed $signature_image_id
 * @property mixed $testimonial
 */
class Influencer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'full_name',
        'short_name',
        'slug',
        'avatar_id',
        'hero_image_id',
        'header_image_id',
        'overlay_image_id',
        'testimonial',
    ];

    public function heroImage()
    {
        return $this->belongsTo(\App\Models\Image::class, 'hero_image_id', 'id');
    }

    public function headerImage()
    {
        return $this->belongsTo(\App\Models\Image::class, 'header_image_id', 'id');
    }

    public function overlayImage()
    {
        return $this->belongsTo(\App\Models\Image::class, 'overlay_image_id', 'id');
    }

    public function signatureImage()
    {
        return $this->belongsTo(\App\Models\Image::class, 'signature_image_id', 'id');
    }

    public function avatar()
    {
        return $this->belongsTo(\App\Models\Avatar::class, 'avatar_id', 'id');
    }

    public function programs()
    {
        return $this->hasMany(\App\Models\Program::class, 'influencer_id', 'id');
    }

    public function toArray($avatar = true, $heroImage = false, $headerImage = false, $overlayImage = false)
    {
        return [
            'slug' => $this->slug,
            'name' => $this->full_name,
            'shortName' => $this->short_name,
            'avatar' => $avatar ? $this->avatar : null,
            'heroImg' => $heroImage ? $this->heroImage : null,
            'headerImg' => $headerImage ? $this->headerImage : null,
            'overlayImg' => $overlayImage ? $this->overlayImage : null,
        ];
    }
}
