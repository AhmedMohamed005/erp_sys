<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// ── Health check (used by Railway / load-balancers) ──
Route::get('/health', function () {
    return response()->json([
        'status'  => 'ok',
        'time'    => now()->toIso8601String(),
    ]);
});

// Load authentication routes
require __DIR__.'/auth.php';

// Additional API routes can be added here
// For example, module-specific API routes can be loaded similarly