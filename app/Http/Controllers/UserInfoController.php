<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Helpers\Arrays;
use App\Models\Avatar;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Intervention\Image\Facades\Image;
use LVR\CountryCode\Two as RuleCountryCode;

class UserInfoController extends Controller
{
    public function view()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $data = [
            'info' => [
                'avatar' => $user->avatar ? $user->avatar->src : null,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'email' => $user->email,
                'phone' => $user->phone,
                'dateOfBirth' => $user->date_of_birth
                    ? Arrays::only(Carbon::parse($user->date_of_birth)->toArray(), ['day', 'month', 'year'])
                    : null,
                'gender' => [
                    $user->gender => null,
                    'MALE' => 'm',
                    'FEMALE' => 'f',
                    'OTHER' => 'x',
                ][$user->gender],
                'address' => $user->street,
                'houseNumber' => $user->house_number,
                'zipCode' => $user->zip_code,
                'city' => $user->city,
                'country' => $user->country,
            ],
        ];
        return Inertia::render('MyFoodimus/user/Info', $data);
    }

    public function viewPassword()
    {
        $data = [];
        return Inertia::render('MyFoodimus/user/Password', $data);
    }

    public function storeInfo(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $request->validate([
            // no required fields because unchanged fields aren't posted
            'firstname' => ['min:1'],
            'lastname' => ['min:1'],

            'phone' => ['regex:/^\+\d{6,}$/'],
            'dateOfBirth' => ['array:year,month,day'],
            'country' => [new RuleCountryCode()],

            'avatar' => ['file'],

        ]);

        if ($request->firstname) {
            $user->firstname = $request->firstname;
        }
        if ($request->lastname) {
            $user->lastname = $request->lastname;
        }
        if ($request->phone) {
            $user->phone = $request->phone;
        }
        if ($request->dateOfBirth) {
            $user->date_of_birth = Carbon::create(
                $request->dateOfBirth['year'],
                $request->dateOfBirth['month'],
                $request->dateOfBirth['day'],
            )->toDateString();
        }
        if ($request->gender) {
            $user->gender = [
                $request->gender => null,
                'm' => 'MALE',
                'f' => 'FEMALE',
                'x' => 'OTHER',
            ][$request->gender];
        }

        if ($request->address) {
            $user->street = $request->address;
        }
        if ($request->houseNumber) {
            $user->house_number = $request->houseNumber;
        }
        if ($request->zipCode) {
            $user->zip_code = $request->zipCode;
        }
        if ($request->city) {
            $user->city = $request->city;
        }
        if ($request->country) {
            $user->country = $request->country;
        }

        $avatar = $request->file('avatar');
        if ($avatar !== null) {
            $imageName = uniqid(date('YmdHis')) . '.' . $avatar->getClientOriginalName();

            $img = Image::make($avatar);
            // Resize images that are too large
            if ($img->width() > 500) {
                $img->resize(null, 500, function ($constraint) {
                    $constraint->aspectRatio();
                });
            }

            $fs = 's3';
            $path = 'avatars/' . $imageName;
            // TODO: remove old avatar
            Storage::disk('s3')->put($path, $img->stream()->detach());

            /** @var mixed $disk */
            $disk = Storage::disk($fs);
            $url = $disk->url($path);
            $avatar = Avatar::create([
                'src' => $url,
                'fs' => $fs,
                'path' => $path,
                'description' => "user {$user->id}",
            ]);

            $user->avatar_id = $avatar->id;
        }

        if ($user->isDirty()) {
            $user->save();
        }
        return Redirect::route('user-info')->with([
            'success' => __('settings.info.saved'),
        ]);
    }

    public function storePassword(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $request->validate([
            'oldPassword' => ['required'],
            'newPassword' => ['required', 'min:8', Rules\Password::defaults()],
        ]);

        if (! Auth::guard('web')->validate([
            'email' => $user->email,
            'password' => $request->oldPassword,
        ])) {
            throw ValidationException::withMessages([
                'oldPassword' => __('auth.password'),
            ]);
        }

        $user->forceFill([
            'password' => Hash::make($request->newPassword),
            'remember_token' => Str::random(60),
        ])->save();

        return Redirect::route('user-password')->with([
            'success' => __('settings.password.saved'),
        ]);
    }
}
