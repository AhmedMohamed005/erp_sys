<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

use App\Http\Middleware\CheckModuleAccess;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',

        // main api
        api: [
            __DIR__.'/../routes/api.php',
            __DIR__.'/../routes/super_admin_api.php',
            __DIR__.'/../routes/accounting_api.php',
            __DIR__.'/../routes/hr_api.php',
            __DIR__.'/../routes/inventory_api.php',
        ],

        // extra api modules
        then: function () {

            require base_path('routes/core.php');
            require base_path('routes/settings.php');
            // Note: accounting.php is now handled via the API routes
            // require base_path('routes/accounting.php');

        },

        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'module.access' => CheckModuleAccess::class,
        ]);

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })

    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })

    ->create();
