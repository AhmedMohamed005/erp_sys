<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Accounting\Controllers\AccountingApiController;

/*
|--------------------------------------------------------------------------
| Accounting API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register accounting API routes for your application.
| These routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// Accounting routes - require authentication and accounting module access
Route::middleware(['auth:sanctum', 'module.access:accounting'])->group(function () {
    // Accounts
    Route::get('/accounting/accounts', [AccountingApiController::class, 'accounts']);
    Route::post('/accounting/accounts', [AccountingApiController::class, 'createAccount']);

    // Journal Entries
    Route::get('/accounting/journal-entries', [AccountingApiController::class, 'journalEntries']);
    Route::post('/accounting/journal-entries', [AccountingApiController::class, 'createJournalEntry']);

    // Invoices
    Route::get('/accounting/invoices', [AccountingApiController::class, 'invoices']);
    Route::post('/accounting/invoices', [AccountingApiController::class, 'createInvoice']);

    // Payments
    Route::get('/accounting/payments', [AccountingApiController::class, 'payments']);
    Route::post('/accounting/payments', [AccountingApiController::class, 'createPayment']);

    // Reports
    Route::get('/accounting/trial-balance', [AccountingApiController::class, 'trialBalance']);
});