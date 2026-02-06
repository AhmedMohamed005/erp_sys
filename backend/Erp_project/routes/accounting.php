<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Accounting\Controllers\TrialBalanceController;

/**
 * Accounting Module Routes
 * 
 * Protected by CheckModuleAccess middleware to ensure
 * the Accounting module is enabled for the company
 */

Route::middleware(['auth', 'module:accounting'])->prefix('accounting')->name('accounting.')->group(function () {
    
    // Trial Balance
    Route::get('/trial-balance', [TrialBalanceController::class, 'index'])->name('trial-balance');
    
    // Accounts
    Route::prefix('accounts')->name('accounts.')->group(function () {
        // Add account routes here
        // Route::get('/', [AccountController::class, 'index']);
        // Route::post('/', [AccountController::class, 'store']);
    });
    
    // Journal Entries
    Route::prefix('journal-entries')->name('journal-entries.')->group(function () {
        // Add journal entry routes here
        // Route::get('/', [JournalEntryController::class, 'index']);
        // Route::post('/', [JournalEntryController::class, 'store']);
    });
    
    // Invoices
    Route::prefix('invoices')->name('invoices.')->group(function () {
        // Add invoice routes here
        // Route::get('/', [InvoiceController::class, 'index']);
        // Route::post('/', [InvoiceController::class, 'store']);
    });
    
    // Payments
    Route::prefix('payments')->name('payments.')->group(function () {
        // Add payment routes here
        // Route::get('/', [PaymentController::class, 'index']);
        // Route::post('/', [PaymentController::class, 'store']);
    });
});
