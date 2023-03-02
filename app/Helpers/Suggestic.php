<?php

declare(strict_types=1);

namespace App\Helpers;

use App\Services\Repositories\ProfileRepository;
use Carbon\Carbon;
use Error;
use Illuminate\Support\Facades\Http;

class Suggestic
{
    /**
     * run query or mutation
     *
     * @param  mixed $query
     * @param  mixed $userId
     * @param  mixed $params
     * @return \stdClass the response body
     */
    public static function run($query, $userId = null, $params = [], $log_error = true): \stdClass
    {
        $headers = [
            'Authorization' => 'Token ' . env('SUGGESTIC_API_KEY'),
            'Content-Type' => 'application/json',
        ];
        if ($userId) {
            $headers['sg-user'] = self::ensureDbId('User', $userId);
        }
        start_measure('suggestic-query', 'running suggestic query');
        debug($query);
        $response = Http::withHeaders($headers)->post(env('SUGGESTIC_BASE_URL'), [
            'query' => $query,
            'variables' => $params,
        ]);
        stop_measure('suggestic-query');

        $body = json_decode($response->body());
        if (isset($body->errors)) {
            $error = var_export([
                'query' => $query,
                'variables' => $params,
                'errors' => $body->errors,
            ], true);
            if ($log_error) {
                error_log($error);
            }
            throw new Error($error);
        }
        return $body;
    }

    /**
     * Suggestic uses a base64 encoded id type in some places, this method helps build those.
     *
     * @param  string $objectType the name of the type of object from the schema
     * @param  string $databaseId the id of the object, usually a uuid
     * @return string the encoded object id
     */
    public static function getId(string $objectType, string $databaseId)
    {
        return base64_encode("${objectType}:${databaseId}");
    }

    /**
     * Ensures that the ID is a base64-type id. Attempts to base64 decode $id and checks the object type. If that's
     * correct, it returns $id. If not, it encodes the id using the specified object type.
     *
     * @param  string $objectType the name of the type of object from the schema
     * @param  string $id the id to check and encode if necessary
     * @return string the base64-encoded id
     */
    public static function ensureB64Id(string $objectType, string $id)
    {
        $decoded = base64_decode($id, true);
        if ($decoded === false || ! str_starts_with($decoded, $objectType . ':')) {
            // not encoded
            return self::getId($objectType, $id);
        }
        // encoded
        return $id;
    }

    /**
     * Ensures that the ID is not a base64-type id. Attempts to base64 decode $id and checks the object type. If that's
     * correct, it returns the decoded $id. If not, it returns the original $id.
     *
     * @param  string $objectType the name of the type of object from the schema
     * @param  string $id the id to check and decode if necessary
     * @return string the decoded id
     */
    public static function ensureDbId(string $objectType, string $id)
    {
        $decoded = base64_decode($id, true);
        if ($decoded === false || ! str_starts_with($decoded, $objectType . ':')) {
            // not encoded
            return $id;
        }
        // encoded, strip off object type and semicolon
        return substr($decoded, strlen($objectType) + 1);
    }

    public static function syncUserProfile(\App\Models\User $user): bool
    {

        /** @var \App\Models\UserDetail $detail */
        $detail = $user->userDetails;

        $allergies = $user->allergies()
            ->select('suggestic_id')
            ->get()
            ->map(function ($i) {
                return $i->suggestic_id;
            })->toArray();

        return ProfileRepository::syncProfile(
            user_id: $user->suggestic_user,
            activityLevel: $detail->activity_level,
            biologicalSex: $user->gender === \App\Models\User::FEMALE ? 'FEMALE' : 'MALE',
            birthdate: Carbon::parse($user->date_of_birth)->toDateString(),
            goalsOn: $detail->apply_goals,
            height: $detail->height,
            isImperial: $detail->unit_type === \App\Models\UserDetail::IMPERIAL,
            startingWeight: $detail->weight,
            targetWeight: $detail->target_weight,
            weeklyWeightGoal: $detail->weekly_goal,
            country: $user->country === null ? 'US' : $user->country,
            timezone: $detail->timezone,
            allergies: $allergies
        );
    }
}
