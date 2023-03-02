<?php

declare(strict_types=1);

namespace App\Nova;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\Country;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\Heading;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Password;

use Laravel\Nova\Fields\Text;

class User extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = \App\Models\User::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'email';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = ['id', 'name', 'email'];

    /**
     * Get the fields displayed by the resource.
     *
     * @return array
     */
    public function fields(Request $request)
    {
        return [
            Heading::make(__('account')),
            ID::make()->sortable(),
            BelongsTo::make(__('avatar'), 'avatar', \App\Nova\Avatar::class)
                ->hideFromIndex(),

            Boolean::make(__('subscribed'), function () {
                return $this->subscribed();
            })->readonly(),
            Boolean::make(__('allow_nova_access'), 'allow_nova_access'),
            Boolean::make(__('subscription_override'), 'subscription_override'),
            Text::make(__('subscription_type'), function () {
                $sub = $this->subscription();
                if ($sub === null) {
                    return null;
                }
                if ($sub->onTrial()) {
                    return __('trial');
                }
                if ($sub->onGracePeriod()) {
                    return __('grace_period');
                }
                if ($sub->active()) {
                    return __('active');
                }
                return __('inactive');
            })->readonly(),
            Text::make(__('subscription_renews'), function () {
                $sub = $this->subscription();
                if ($sub === null) {
                    return null;
                }
                $str = $sub->asStripeSubscription();
                if ($str === null) {
                    return null;
                }
                if ($sub->onTrial()) {
                    return Carbon::createFromTimeStamp($str->trial_end);
                }
                if ($sub->active()) {
                    return Carbon::createFromTimeStamp($str->current_period_end);
                }
                return null;
            })->hideFromIndex()
                ->readonly(),
            Text::make(__('email'), 'email')
                ->sortable()
                ->rules('required', 'email', 'max:254')
                ->creationRules('unique:users,email')
                ->updateRules('unique:users,email,{{resourceId}}'),

            Password::make(__('password'), 'password')
                ->onlyOnForms()
                ->creationRules('required', 'string', 'min:8')
                ->updateRules('nullable', 'string', 'min:8'),

            Heading::make(__('personal')),
            Text::make(__('firstname'), 'firstname')
                ->sortable()
                ->rules('required', 'max:254'),

            Text::make(__('lastname'), 'lastname')
                ->sortable()
                ->rules('required', 'max:254'),

            Date::make(__('date_of_birth'), 'date_of_birth')
                ->onlyOnForms(),

            Heading::make(__('contact')),
            Text::make(__('phone'), 'phone')
                ->nullable()
                ->hideFromIndex(),
            Text::make(__('street'), 'street')
                ->nullable()
                ->hideFromIndex(),
            Text::make(__('house_number'), 'house_number')
                ->nullable()
                ->hideFromIndex(),
            Text::make(__('zip_code'), 'zip_code')
                ->nullable()
                ->hideFromIndex(),
            Text::make(__('city'), 'city')
                ->nullable()
                ->hideFromIndex(),
            Country::make(__('country'), 'country')
                ->displayUsingLabels()
                ->hideFromIndex(),

            Heading::make(__('technical')),
            Text::make(__('suggestic_user'), 'suggestic_user')
                ->nullable()
                ->hideFromIndex(),
            Text::make(__('suggestic_profile'), 'suggestic_profile')
                ->nullable()
                ->hideFromIndex(),

        ];
    }

    /**
     * Get the cards available for the request.
     *
     * @return array
     */
    public function cards(Request $request)
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @return array
     */
    public function filters(Request $request)
    {
        return [];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @return array
     */
    public function lenses(Request $request)
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @return array
     */
    public function actions(Request $request)
    {
        return [];
    }
}
