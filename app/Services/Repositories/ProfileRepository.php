<?php

declare(strict_types=1);

namespace App\Services\Repositories;

use Illuminate\Support\Facades\Facade;

/**
 * ProfileRepository
 *
 * @method static \App\Http\Resources\ProfileStub getStub($user_id)
 * @method static bool syncProfile(string $user_id, string $activityLevel, string $biologicalSex, string $birthdate, bool $goalsOn, float $height, bool $isImperial, float $startingWeight, float $targetWeight, string $weeklyWeightGoal, string $country, string $timezone, array $allergies)
 */
class ProfileRepository extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'App\Repositories\ProfileRepositoryInterface';
    }
}
