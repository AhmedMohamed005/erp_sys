<?php

namespace App\Modules\Inventory\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * Inventory Module API Controller
 * 
 * This module will handle:
 * - Product management (CRUD)
 * - Warehouse/location management
 * - Stock movements (in/out)
 * - Stock adjustments
 * - Inventory reports
 * - Purchase orders (integrates with Accounting module)
 * 
 * Future endpoints:
 * GET    /api/inventory/products              - List products
 * POST   /api/inventory/products              - Create product
 * GET    /api/inventory/products/{id}          - Get product details
 * PUT    /api/inventory/products/{id}          - Update product
 * DELETE /api/inventory/products/{id}          - Delete product
 * GET    /api/inventory/warehouses             - List warehouses
 * POST   /api/inventory/warehouses             - Create warehouse
 * GET    /api/inventory/stock-movements        - List stock movements
 * POST   /api/inventory/stock-movements        - Create stock movement
 * GET    /api/inventory/stock-levels           - Current stock levels report
 * GET    /api/inventory/purchase-orders        - List purchase orders
 * POST   /api/inventory/purchase-orders        - Create purchase order
 */
class InventoryApiController extends Controller
{
    /**
     * Module info endpoint - shows module status and available features
     */
    public function info(Request $request)
    {
        return response()->json([
            'module' => 'Inventory',
            'version' => '1.0.0',
            'status' => 'planned',
            'features' => [
                'products' => 'Product management (CRUD)',
                'warehouses' => 'Warehouse/location management',
                'stock_movements' => 'Stock movements (in/out)',
                'stock_adjustments' => 'Stock adjustments',
                'reports' => 'Inventory reports',
                'purchase_orders' => 'Purchase orders (integrates with Accounting)',
            ],
            'message' => 'Inventory module is planned for future development. Structure is ready for implementation.',
        ]);
    }
}
