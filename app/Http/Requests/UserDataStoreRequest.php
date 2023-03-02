<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class UserDataStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'firstname' => 'required',
            'lastname' => 'required',
            'email' => 'required|email',
            'date_of_birth' => 'required|date',
            'gender' => ['required', Rule::in([User::OTHER, User::FEMALE, User::MALE])],
            'height' => 'required|numeric|between:0,250',
            'activity_level' => 'required|in:NOT_ACTIVE,EXERCISE_1,EXERCISE_2',
            'weight' => 'required|numeric|between:0,600',
            'target_weight' => 'required|numeric|between:0,600',
            'weekly_goal' => 'required|in:MAINTAIN,GOAL_1,GOAL_2,GOAL_3,GOAL_4',
            'is_imperial' => 'required|boolean',
        ];
    }

    public static function fromTypeform(string $responseId)
    {
        $apiToken = env('TYPEFORM_API_TOKEN');
        $formId = env('ONBOARDING_TYPEFORM_FORM_ID');

        $url = "https://api.typeform.com/forms/${formId}/responses";
        $response = Http::withToken($apiToken)->get($url, [
            'included_response_ids' => $responseId,
        ]);

        $status = $response->status();
        if ($status !== 200) {
            throw new HttpException(502);
        }
        $body = $response->json();
        if (count($body['items']) !== 1) {
            throw new BadRequestHttpException();
        }

        $answers = array_merge(...array_map('self::parseAnswer', $body['items'][0]['answers']));
        $imperial = $answers['unit'] === 'IMPERIAL';
        $unit_suffix = $imperial ? 'imperial' : 'metric';
        $req = new self();
        $gender = strtolower($answers['gender']);
        $req->merge([
            'firstname' => $answers['firstName'],
            'lastname' => $answers['lastName'],
            'email' => $answers['email'],
            'date_of_birth' => Carbon::parse($answers['dateOfBirth'])->toDateString(),
            'gender' => [
                $gender => User::OTHER,
                'f' => User::FEMALE,
                'm' => User::MALE,
            ][$gender],
            'height' => $answers["height-${unit_suffix}"],
            'weight' => $answers["weight-${unit_suffix}"],
            'target_weight' => $answers["targetWeight-${unit_suffix}"],
            'weekly_goal' => $answers["weeklyGoal-${unit_suffix}"],
            'activity_level' => $answers['activity'],
            'is_imperial' => $imperial,
        ]);
        $req->validate($req->rules());
        return $req;
    }

    /**
     * Parse the format from TypeForm into something more usable
     */
    private static function parseAnswer($answer)
    {
        $name = $answer['field']['ref'];
        $type = $answer['type'];
        switch ($type) {
            case 'choice':
                $value = $answer['choice']['ref'];
                break;
            default:
                $value = $answer[$type];
                break;
        }
        return [
            $name => $value,
        ];
    }
}
