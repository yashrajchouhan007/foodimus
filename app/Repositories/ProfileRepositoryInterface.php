<?php

declare(strict_types=1);

namespace App\Repositories;

interface ProfileRepositoryInterface
{
    public function getStub($user_id): \App\Http\Resources\ProfileStub;

    public function syncProfile(
        string $user_id,
        string $activityLevel,
        string $biologicalSex,
        string $birthdate,
        bool $goalsOn,
        float $height,
        bool $isImperial,
        float $startingWeight,
        float $targetWeight,
        string $weeklyWeightGoal,
        string $country,
        string $timezone,
        array $allergies
    ): bool;
}
