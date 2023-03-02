<?php

declare(strict_types=1);

namespace App\Helpers;

class Arrays
{
    /**
     * search through an array using a predicate
     *
     * @param  mixed $predicate
     * @return mixed|null the selected value
     */
    public static function search(mixed $array, callable $predicate)
    {
        foreach ($array as  $v) {
            if (call_user_func($predicate, $v)) {
                return $v;
            }
        }
        return null;
    }

    /**
     * Transform an array into an associative one by choosing a key
     *
     * @param  mixed $array the array to transform
     * @param  mixed $getKey a string signifying which key to use as
     * the array key, or a callable returning the key for each item
     * @return mixed an associative copy of the original array
     */
    public static function byKey(mixed $array, mixed $getKey, bool $removeKey = false): array
    {
        $keyName = null;
        if (is_string($getKey)) {
            $keyName = $getKey;
            $getKey = function ($v) use ($keyName) {
                if (is_array($v)) {
                    return $v[$keyName];
                }
                if (is_object($v)) {
                    return $v->{$keyName};
                }
                throw new \Error("Unable to select key ${keyName}");
            };
        } else {
            $removeKey = false;
        }
        $result = [];
        foreach ($array as $v) {
            $key = call_user_func($getKey, $v);
            if ($removeKey) {
                $v = array_filter($v, function ($k) use ($keyName) {
                    return $k !== $keyName;
                }, ARRAY_FILTER_USE_KEY);
            }
            $result[$key] = $v;
        }
        return $result;
    }

    /**
     * Flatten a two-dimensional array
     *
     * @param  mixed $array the array to flatten
     * @param  mixed $selector an optional callable that selects the subarray for each item.
     * If omitted, the method assumes $array is a simple 'array of arrays'
     * @return array a flattened copy of the array
     */
    public static function flatten(mixed $array, mixed $selector = null)
    {
        if (is_string($selector)) {
            $keyKey = $selector;
            $selector = function ($v) use ($keyKey) {
                if (is_array($v)) {
                    return $v[$keyKey];
                }
                if (is_object($v)) {
                    return $v->{$keyKey};
                }
                throw new \Error("Unable to select key ${keyKey}");
            };
        }
        $result = [];
        foreach ($array as $subarray) {
            if ($selector) {
                $subarray = $selector($subarray);
            }
            foreach ($subarray as $item) {
                $result[] = $item;
            }
        }
        return $result;
    }

    public static function chunk(array $source, int $size)
    {
        $chunks = [];
        $rest = array_slice($source, 0);
        while (count($rest)) {
            $chunks[] = array_splice($rest, 0, $size);
        }
        return $chunks;
    }

    public static function only(array $source, array $keys)
    {
        return array_filter($source, function ($key) use ($keys) {
            return in_array($key, $keys, true);
        }, ARRAY_FILTER_USE_KEY);
    }
}
