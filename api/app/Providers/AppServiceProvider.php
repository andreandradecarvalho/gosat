<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(
            \App\Interfaces\CreditOfferSimulationInterface::class,
            \App\Repositories\CreditOfferSimulationRepository::class
        );
    }
}
