<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SuperAdminController;

/*
|--------------------------------------------------------------------------
| Super Admin API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register super admin API routes for your application.
| These routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// Super Admin routes - require super admin role
Route::middleware(['auth:sanctum', 'can:super-admin'])->group(function () {
    // Company management
    Route::get('/companies', [SuperAdminController::class, 'listCompanies']); // List all companies
    Route::post('/companies', [SuperAdminController::class, 'createCompany']); // Create company

    // Module management
    Route::post('/modules/toggle', [SuperAdminController::class, 'toggleModule']);
});

// Authenticated user routes - accessible to all authenticated users
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/companies/{id}', [SuperAdminController::class, 'showCompany']); // Get specific company (own or any if super admin)
    Route::get('/my-company', [SuperAdminController::class, 'myCompany']); // Get authenticated user's company
});