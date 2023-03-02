<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\FinishAccountSetupController;
use App\Http\Controllers\InfluencerController;
use App\Http\Controllers\MealPlanController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\OverviewController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\UserInfoController;
use App\Http\Controllers\UserPersonalController;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Route::get('/', function () {
//    return Inertia::render('Welcome', [
//        'canLogin' => Route::has('login'),
//        'canRegister' => Route::has('register'),
//        'laravelVersion' => Application::VERSION,
//        'phpVersion' => PHP_VERSION,
//    ]);
//});


Route::get('privacy-policy', function () {
    $content = file_get_contents(__DIR__ . '/../resources/content/privacypol.en-US.md');

    return Inertia::render('MyFoodimus/Static', [
        'content' => $content,
    ]);
})->name('privacypol');
Route::get('terms', function () {
    $content = file_get_contents(__DIR__ . '/../resources/content/terms.en-US.md');

    return Inertia::render('MyFoodimus/Static', [
        'content' => $content,
    ]);
})->name('terms');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('subscription')->group(function () {
        Route::get('subscribe', [SubscriptionController::class, 'subscribe'])->name('subscription.subscribe');
        Route::get('create', [SubscriptionController::class, 'create'])->name('subscription.create');
        Route::get('cancel', [SubscriptionController::class, 'cancel'])->name('subscription.cancel');
    });
    Route::prefix('payment-method')->group(function () {
        Route::get('create', [PaymentMethodController::class, 'subscribe'])->name('payment_method.create');
        Route::post('save', [PaymentMethodController::class, 'save'])->name('payment_method.save');
        Route::post('set-default', [PaymentMethodController::class, 'setDefault'])->name('payment_method.set_default');
        Route::post('delete', [PaymentMethodController::class, 'delete'])->name('payment_method.delete');
    });
    Route::prefix('user')->group(function () {
        Route::get('/', function () {
            return Redirect::route('user-info');
        })->name('user');

        Route::get('/subscription/{modal?}', [SubscriptionController::class, 'view'])->name('user-subscription');

        Route::get('/info', [UserInfoController::class, 'view'])->name('user-info');
        Route::post('/update-info', [UserInfoController::class, 'storeInfo'])->name('user-update-info');

        Route::get('/password', [UserInfoController::class, 'viewPassword'])->name('user-password');
        Route::post('/update-password', [UserInfoController::class, 'storePassword'])->name('user-update-password');

        Route::get('/personal', [UserPersonalController::class, 'view'])->name('user-personal');
        Route::get('/allergies', [UserPersonalController::class, 'viewAllergies'])->name('user-personal-allergies');
        Route::get('/goals', [UserPersonalController::class, 'viewGoals'])->name('user-personal-goals');
        Route::post('/update-preferences', [UserPersonalController::class, 'storePreferences'])->name(
            'user-update-preferences'
        );
        Route::post('/update-goals', [UserPersonalController::class, 'storeGoals'])->name('user-update-goals');
        Route::post('/update-allergies', [UserPersonalController::class, 'storeAllergies'])->name(
            'user-update-allergies'
        );
    });

    Route::middleware(['subscribed'])->group(function () {
        Route::get('/', [OverviewController::class, 'view'])->name('overview');
        Route::get('/today', function () {
            $timezone = \Illuminate\Support\Facades\Auth::user()->userDetails->timezone;
            return Redirect::route('meals', [
                'date' => \Carbon\Carbon::now($timezone)->toDateString(),
            ]);
        })->name('today');

        Route::get('/meals/{date}', [App\Http\Controllers\MealsController::class, 'view'])
            ->where('date', '\d{4}-\d{2}-\d{2}')
            ->name('meals');

        Route::get(
            '/meals/{date}/{slug}',
            [App\Http\Controllers\MealController::class, 'info']
        )->where('date', '\d{4}-\d{2}-\d{2}')
            ->name('meal');
        Route::get(
            '/meals/{date}/{slug}/ingredients',
            [App\Http\Controllers\MealController::class, 'ingredients']
        )->where('date', '\d{4}-\d{2}-\d{2}')
            ->name('ingredients');
        Route::get(
            '/meals/{date}/{slug}/recipe',
            [App\Http\Controllers\MealController::class, 'recipe']
        )->where('date', '\d{4}-\d{2}-\d{2}')
            ->name('recipe');
        Route::get(
            '/meals/{date}/{slug}/nutrition',
            [App\Http\Controllers\MealController::class, 'nutrition']
        )->where('date', '\d{4}-\d{2}-\d{2}')
            ->name('nutrition');

        Route::get(
            '/shopping-list/{date?}/{slug?}',
            [\App\Http\Controllers\ShoppingListController::class, 'view']
        )->where('date', '(\d{4}-\d{2}-\d{2}|mealplan)')
            ->name('shopping-list');

        Route::get('/browse/{section?}', [SearchController::class, 'view'])->where('section', '(meal-plan|ambassador)')
            ->name('search');

        Route::get('/ambassador/{slug}', [InfluencerController::class, 'view'])->name('ambassador');

        Route::get('/meal-plan/{slug}', [MealPlanController::class, 'view'])->name('meal-plan');

        Route::post('/meal-plan/{slug}/activate', [MealPlanController::class, 'activate'])
            ->name('activate-meal-plan');
    });
    Route::get('/new-user/payment', [FinishAccountSetupController::class, 'paymentView'])
        ->name('setup-payment');

    Route::get('/redirect', function (\Illuminate\Http\Request $request) {
        $url = null;
        $route = null;
        $routeParam = [];
        $refererStr = $request->query('referer');
        if ($refererStr !== null) {
            $referer = explode(':', $refererStr, 2);
            if (count($referer) === 2) {
                [$obj, $slug] = $referer;
                switch ($obj) {
                    case 'ambassador':
                    case 'influencer': //legacy links
                        $route = 'ambassador';
                        $routeParam = [
                            'slug' => $slug,
                        ];
                        break;
                    case 'meal-plan':
                        $route = 'meal-plan';
                        $routeParam = [
                            'slug' => $slug,
                        ];
                        break;
                }
            }
        }
        if ($route) {
            $url = route($route, $routeParam);
        } elseif ($request->query('defaultUrl')) {
            $url = $request->query('defaultUrl');
        } elseif ($request->query('default')) {
            $url = route($request->query('default'), $request->query('defaultParam') ?? []);
        } else {
            $url = route('overview');
        }
        return redirect($url);
    })->name('redirect');
});

Route::get('/new-user/password/{token}', [FinishAccountSetupController::class, 'create'])
    ->name('finish-setup');

Route::post('/new-user/password/store', [FinishAccountSetupController::class, 'store'])
    ->name('finish-setup.store');



Route::post('nova/login', function () {
    return Redirect::route('login');
})->name('nova.login');

Route::get('nova/login', function () {
    return Redirect::route('login');
})->name('nova.login');

Route::get('/onboarding', [OnboardingController::class, 'create'])
    ->name('onboarding');

Route::post('/onboarding/complete', [OnboardingController::class, 'store'])
    ->name('onboarding.store');




require __DIR__ . '/auth.php';
