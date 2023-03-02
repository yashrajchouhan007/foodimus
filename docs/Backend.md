# My Foodimus back-end

The back-end of My Foodimus is pretty standard, but there are some things to keep in mind:

## `app/Models`
The models may contain a very minor amount of code other than relation definitions, to access associated objects from Suggestic

## `app/Http/Resources`
These are remote resources that we can fetch from the Suggestic API

## `app/Repositories`
This folder contains repository interfaces.

## `app/Repositories/Suggestic`
This folder contains implementations for the repository interfaces
These implementations are registered with their interfaces in `app/Providers/SuggesticServiceProvider.php`

## `app/Services/Repositories`
This folder contains facades that you can use to easily access Suggestic resources
Usage example: 
```php
\App\Services\Repositories\MealPlanTemplateRepository::get($this->suggestic_template_id);
```

