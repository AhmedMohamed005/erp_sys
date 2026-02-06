<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Modules\Accounting\Controllers\AccountController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Accounting module routes with module access middleware
Route::middleware(['auth', 'module.access:accounting'])->group(function () {
    Route::prefix('accounting')->group(function () {
        Route::get('/accounts', [AccountController::class, 'index'])->name('accounting.accounts.index');
        Route::post('/accounts', [AccountController::class, 'store'])->name('accounting.accounts.store');
    });
});

require __DIR__.'/settings.php';
