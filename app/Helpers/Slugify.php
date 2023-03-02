<?php

declare(strict_types=1);

namespace App\Helpers;

class Slugify
{
    /**
     * Transform a string into a slug
     *
     * @param  string $text the string to slugify
     * @param  string $divider the devider to use (default is -)
     * @return string the slugified string
     */
    public static function slugify(string $text, string $divider = '-')
    {
        // replace non letter or digits by divider
        $text = preg_replace('~[^\pL\d]+~u', $divider, $text);

        // transliterate
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

        // remove unwanted characters
        $text = preg_replace('~[^-\w]+~', '', $text);

        // trim
        $text = trim($text, $divider);

        // remove duplicate divider
        $text = preg_replace('~-+~', $divider, $text);

        // lowercase
        $text = strtolower($text);

        if (empty($text)) {
            return 'n-a';
        }

        return $text;
    }
}
