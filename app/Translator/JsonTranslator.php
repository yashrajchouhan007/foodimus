<?php

declare(strict_types=1);

namespace App\Translator;

use Illuminate\Translation\Translator as BaseTranslator;

class JsonTranslator extends BaseTranslator
{
    /**
     * @param string $key
     * @param null $locale
     * @param bool $fallback
     *
     * @return array|null|string|void
     */
    public function get($key, array $replace = [], $locale = null, $fallback = true)
    {
        $translation = "${key}";
        try {
            $translation = parent::get($key, $replace, $locale, $fallback);
            if ($translation === $key) {
                throw new \Exception("No translation found for key ${key}");
            }
        } catch (\Exception $e) {
            //\Sentry\withScope(function (\Sentry\State\Scope $scope) use ($e, $key, $locale): void {
            //    $scope->setContext('requested_translation', [
            //        'key' => $key,
            //        'locale' => $locale ?? config('app.locale'),
            //    ]);
            //
            //    \Sentry\captureException($e);
            //});
        } finally {
            return $translation;
        }
    }
}
