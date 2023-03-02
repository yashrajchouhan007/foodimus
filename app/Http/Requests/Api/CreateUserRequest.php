<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateUserRequest extends FormRequest
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
            'email' => 'required|unique:App\Models\User|email',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:m,f,x',
            'height' => 'required|numeric|between:0,250',
            'activity_level' => 'required|in:NOT_ACTIVE,EXERCISE_1,EXERCISE_2',
            'weight' => 'required|numeric|between:0,600',
            'target_weight' => 'required|numeric|between:0,600',
            'weekly_goal' => 'required|in:MAINTAIN,GOAL_1,GOAL_2,GOAL_3,GOAL_4',
            'is_imperial' => 'required|boolean',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation errors',
            'data' => $validator->errors(),
        ]));
    }
}
