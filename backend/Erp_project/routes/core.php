<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Core\CompanyRegistrationController;

/**
 * Core Module Routes
 * These routes handle core platform functionality
 */

// Public company registration
Route::post('/register-company', [CompanyRegistrationController::class, 'register'])->name('company.register');

// Protected routes
Route::middleware(['auth'])->prefix('core')->name('core.')->group(function () {
    
    // Company management (super admin only)
    Route::middleware(['can:super-admin'])->prefix('companies')->name('companies.')->group(function () {
        Route::post('/{company}/modules', [CompanyRegistrationController::class, 'assignModules'])->name('assign-modules');
        Route::patch('/{company}/modules/toggle', [CompanyRegistrationController::class, 'toggleModule'])->name('toggle-module');
    });
    
    // Users management
    Route::prefix('users')->name('users.')->group(function () {
        // Add user management routes here
    });
});
