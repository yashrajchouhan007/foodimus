<?php

declare(strict_types=1);

namespace App\Repositories\Suggestic;

use App\Helpers\Suggestic;
use App\Http\Resources\ProfileStub;

class ProfileRepository implements \App\Repositories\ProfileRepositoryInterface
{
    public function getStub($user_id): ProfileStub
    {
        $query = <<<GQL
        {
          myProfile{
            id
            email
            timezone
            dailyCaloricIntakeGoal
          }
        }
        GQL;

        return ProfileStub::make(Suggestic::run($query, userId: $user_id)->data->myProfile);
    }

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
    ): bool {
        $query = <<<'GQL'
      mutation(
        $activityLevel: ActivityLevel!
        $biologicalSex: BiologicalSex!
        $birthdate: Date!
        $goalsOn: Boolean!
        $height: Float!
        $isImperial: Boolean
        $startingWeight: Float!
        $targetWeight: Float!
        $weeklyWeightGoal: WeeklyWeightGoal!
        $country: String!
        $language: Language!
        $mpDiversity: MealPlanDiversity!
        $timezone: String!
        $restrictions: [ID]
      ){
        result1:profileMacroGoalsSettings(          
          activityLevel: $activityLevel
          biologicalSex: $biologicalSex
          birthdate: $birthdate
          goalsOn: $goalsOn
          height: $height
          isImperial: $isImperial
          startingWeight: $startingWeight
          targetWeight: $targetWeight
          weeklyWeightGoal: $weeklyWeightGoal
        ){
          success
        }
        result2:updateProfile(
          country: $country
          language: $language
          mpDiversity: $mpDiversity
          timezone: $timezone
        ){
          success
        }
        result3:profileRestrictionsUpdate(
          replace: true
          restrictions: $restrictions
        ){
          success
        }
      }
    GQL;
        $data = Suggestic::run($query, userId: $user_id, params: [
            'activityLevel' => $activityLevel,
            'biologicalSex' => $biologicalSex,
            'birthdate' => $birthdate,
            'goalsOn' => $goalsOn,
            'height' => $height,
            'isImperial' => $isImperial,
            'startingWeight' => $startingWeight,
            'targetWeight' => $targetWeight,
            'weeklyWeightGoal' => $weeklyWeightGoal,
            'country' => $country,
            'language' => 'EN',
            'mpDiversity' => 'MEDIUM',
            'timezone' => $timezone,
            'restrictions' => array_map(function ($id) {
                return Suggestic::ensureB64Id('Restriction', $id);
            }, $allergies),
        ])->data;
        return $data->result1->success && $data->result2->success && $data->result3->success;
    }
}
