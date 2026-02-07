<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Core\CompanyRegistrationController;
use App\Http\Controllers\Core\UserController;

/**
 * Core Module Routes
 * These routes handle core platform functionality
 */

// Public company registration
Route::post('/register-company', [CompanyRegistrationController::class, 'register'])->name('company.register');

// Protected routes
Route::middleware(['auth:sanctum'])->prefix('core')->name('core.')->group(function () {
    
    // Company management (super admin only)
    Route::middleware(['can:super-admin'])->prefix('companies')->name('companies.')->group(function () {
        Route::post('/{company}/modules', [CompanyRegistrationController::class, 'assignModules'])->name('assign-modules');
        Route::patch('/{company}/modules/toggle', [CompanyRegistrationController::class, 'toggleModule'])->name('toggle-module');
    });
    
    // Users management (accessible to admins and super admins)
    
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index'); // GET /core/users
        Route::get('/{id}', [UserController::class, 'show'])->name('show'); // GET /core/users/{id}
        Route::post('/', [UserController::class, 'store'])->name('store'); // POST /core/users
        Route::put('/{id}', [UserController::class, 'update'])->name('update'); // PUT /core/users/{id}
        Route::patch('/{id}', [UserController::class, 'update'])->name('update-patch'); // PATCH /core/users/{id}
        Route::delete('/{id}', [UserController::class, 'destroy'])->name('destroy'); // DELETE /core/users/{id}
    });
});
