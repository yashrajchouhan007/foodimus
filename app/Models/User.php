<?php

declare(strict_types=1);

namespace App\Models;

use App\Services\Repositories\MealPlanRepository;
use App\Services\Repositories\ProfileRepository;
use App\Traits\Billable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Cache;

/**
 * User
 *
 * @property mixed $id
 * @property mixed $role_id
 * @property mixed $gender
 * @property mixed $firstname
 * @property mixed $middlename
 * @property mixed $lastname
 * @property mixed $email
 * @property mixed $date_of_birth
 * @property mixed $phone
 * @property mixed $street
 * @property mixed $house_number
 * @property mixed $zip_code
 * @property mixed $city
 * @property mixed $country
 *
 * @property mixed $email_verified_at
 * @property mixed $password
 * @property mixed $remember_token
 * @property mixed $created_at
 * @property mixed $updated_at
 * @property mixed $stripe_id
 * @property mixed $pm_type
 * @property mixed $pm_last_four
 * @property mixed $trial_ends_at
 * @property mixed $suggestic_user
 * @property mixed $suggestic_profile
 * @property mixed $active_meal_plan_template
 * @property mixed $avatar_id
 *
 * @property mixed $allow_nova_access
 * @property mixed $subscription_override
 */
class User extends Authenticatable
{
    use HasFactory;

    use Notifiable;

    use Billable;

    public const MALE = 'MALE';

    public const FEMALE = 'FEMALE';

    public const OTHER = 'OTHER';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'gender', 'firstname', 'middlename',
        'lastname', 'date_of_birth', 'email',
        'password', 'suggestic_user', 'suggestic_profile',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'date_of_birth' => 'date',
    ];

    public function roles()
    {
        return $this->hasOne(\App\Models\Role::class);
    }

    public function userDetails()
    {
        return $this->hasOne(\App\Models\UserDetail::class);
    }

    public function avatar()
    {
        return $this->belongsTo(\App\Models\Avatar::class, 'avatar_id', 'id');
    }

    public function programs()
    {
        return $this->hasManyThrough(
            \App\Models\Program::class,
            \App\Models\UserMealPlan::class,
            'user_id', // key of user in user_meal_plan
            'id', // key of user_meal_plan in meal_plan_templates
            'id', // local key of user
            'program_id' // key of meal_plan_template in user_meal_plan
        );
    }

    public function userMealPlans()
    {
        return $this->hasMany(
            \App\Models\UserMealPlan::class,
            'user_id', // key of user in user_meal_plan
            'id', // local key of user
        );
    }

    public function userAllergies()
    {
        return $this->hasMany(
            \App\Models\UserAllergy::class,
            'user_id', // key of user in user_allergy
            'id', // local key of user
        );
    }

    public function allergies()
    {
        return $this->hasManyThrough(
            \App\Models\Allergy::class,
            \App\Models\UserAllergy::class,
            'user_id', // key of user in user_allergy
            'id', // key of user_allergy in allergies
            'id', // local key of user
            'allergy_id' // key allergy in user_allergy
        );
    }

    /**
     * Get the data required for the Laravel\Cashier\Subscription::create function
     */
    public function getStripeSubscriptionData(): array
    {
        return [
            'email' => $this->email,
            'name' => $this->name,
        ];
    }

    /**
     * Get an array of all stripe customer parameters as expecter by Stripe\Customer::create
     *
     * @return array Array of stripe customer parameters
     */
    public function getStripeCustomerParams(): array
    {
        return [
            'email' => $this->email,
            'name' => $this->name,
        ];
    }

    public function getRemoteProfileStub(): \App\Http\Resources\ProfileStub
    {
        return ProfileRepository::getStub($this->suggestic_user);
    }

    public function clearRemoteMealPlanCache()
    {
        Cache::forget("Suggestic-UserMealPlan-{$this->suggestic_user}-*");
        Cache::forget("Suggestic-UserRecipeIngredients-{$this->suggestic_user}-*");
    }

    public function getRemoteMealPlan(
        string $fromDate,
        bool $includeMeals = false,
        bool $includeRecipe = false,
        bool $includeNutrients = false
    ): null|\App\Http\Resources\MealPlan {
        return Cache::remember(
            "Suggestic-UserMealPlan-{$this->suggestic_user}-{$fromDate}",
            3600,
            function () use ($fromDate) {
                return MealPlanRepository::get($this->suggestic_user, $fromDate, true, true, true,);
            }
        );
    }

    public function toArray()
    {
        $arr = [
            'avatar' => $this->avatar,
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'email' => $this->email,
        ];
        if (! ! $this->allow_nova_access === true) {
            $arr['cms_url'] = '/nova';
        }
        return $arr;
    }
}
