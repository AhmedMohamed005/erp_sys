<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Inventory\Controllers\InventoryApiController;

/*
|--------------------------------------------------------------------------
| Inventory Module API Routes
|--------------------------------------------------------------------------
|
| Routes for the Inventory module. All routes require authentication
| and the 'inventory' module to be active for the user's company.
|
*/

Route::middleware(['auth:sanctum', 'module.access:inventory'])->group(function () {
    // Module info
    Route::get('/inventory/info', [InventoryApiController::class, 'info']);

    // Future: Product management
    // Route::get('/inventory/products', [InventoryApiController::class, 'products']);
    // Route::post('/inventory/products', [InventoryApiController::class, 'createProduct']);
    // Route::get('/inventory/products/{id}', [InventoryApiController::class, 'showProduct']);
    // Route::put('/inventory/products/{id}', [InventoryApiController::class, 'updateProduct']);
    // Route::delete('/inventory/products/{id}', [InventoryApiController::class, 'destroyProduct']);

    // Future: Warehouse management
    // Route::get('/inventory/warehouses', [InventoryApiController::class, 'warehouses']);
    // Route::post('/inventory/warehouses', [InventoryApiController::class, 'createWarehouse']);

    // Future: Stock movements
    // Route::get('/inventory/stock-movements', [InventoryApiController::class, 'stockMovements']);
    // Route::post('/inventory/stock-movements', [InventoryApiController::class, 'createStockMovement']);

    // Future: Reports
    // Route::get('/inventory/stock-levels', [InventoryApiController::class, 'stockLevels']);

    // Future: Purchase orders
    // Route::get('/inventory/purchase-orders', [InventoryApiController::class, 'purchaseOrders']);
    // Route::post('/inventory/purchase-orders', [InventoryApiController::class, 'createPurchaseOrder']);
});
