<?php

declare(strict_types=1);

namespace App\Helpers;

class ResourceArray
{
    /**
     * Builds an array from a resource and a specification
     * The specification is an array with an optionally mixed set of items:
     * - unnamed fields mean that a field should be added to the array as is
     * - named fields with an array value mean that the field is an object that should be
     *   parsed recursively
     * - named fields with a callable value mean that the field will be parsed by the function
     *
     * @param  mixed $obj the resource
     * @param  mixed $fields the fields array
     */
    public static function build(mixed $obj, ...$fields): array
    {
        $result = [];
        foreach ($fields as $k => $v) {
            if (is_int($k)) {
                // normal value field
                $result[$v] = isset($obj->{$v}) ? $obj->{$v} : null;
            } elseif (is_array($v)) {
                // recursively parse object
                $result[$k] = isset($obj->{$k}) ? self::build($obj->{$k}, ...$v) : null;
            } elseif (is_callable($v)) {
                // call function
                $result[$k] = isset($obj->{$k}) ? $v($obj->{$k}) : null;
            }
        }
        return $result;
    }
}
