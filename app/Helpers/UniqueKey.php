<?php

declare(strict_types=1);

namespace App\Helpers;

class UniqueKey
{
    /**
     * Selects a key for items in an array. Optionally you can provide a check method if you want to do something else
     * than check for uniqueness. By default, it only checks for uniqueness.
     *
     * @param  mixed $array the array
     * @param  string $preferred the preferred id, that may be augmented with a suffix
     * @param  string $spacer the spacer to put in front of the suffix
     * @param  callable $check an optional check method that returns true when the key is usable
     * @return string the selected key
     */
    public static function get(mixed $array, string $preferred, string $spacer = '-', callable $check = null)
    {
        if ($check === null) {
            $check = function ($array, $key) {
                return ! isset($array[$key]);
            };
        }
        if ($check($array, $preferred)) {
            return $preferred;
        }
        $suffix = 1;
        while (! $check($array, "${preferred}${spacer}${suffix}")) {
            $suffix++;
            if ($suffix > 100) {
                throw new \Exception("Unable to generate slug for ${preferred}");
            }
        }
        return "${preferred}${spacer}${suffix}";
    }
}
