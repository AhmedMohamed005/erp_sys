<?php

namespace App\Modules\HR\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * HR Module API Controller
 * 
 * This module will handle:
 * - Employee management (CRUD)
 * - Department management
 * - Attendance tracking
 * - Leave management
 * - Payroll processing (integrates with Accounting module)
 * 
 * Future endpoints:
 * GET    /api/hr/employees          - List employees
 * POST   /api/hr/employees          - Create employee
 * GET    /api/hr/employees/{id}     - Get employee details
 * PUT    /api/hr/employees/{id}     - Update employee
 * DELETE /api/hr/employees/{id}     - Delete employee
 * GET    /api/hr/departments        - List departments
 * POST   /api/hr/departments        - Create department
 * GET    /api/hr/attendance         - Get attendance records
 * POST   /api/hr/attendance         - Record attendance
 * GET    /api/hr/leaves             - List leave requests
 * POST   /api/hr/leaves             - Submit leave request
 * PATCH  /api/hr/leaves/{id}/status - Approve/reject leave
 */
class HRApiController extends Controller
{
    /**
     * Module info endpoint - shows module status and available features
     */
    public function info(Request $request)
    {
        return response()->json([
            'module' => 'HR',
            'version' => '1.0.0',
            'status' => 'planned',
            'features' => [
                'employees' => 'Employee management (CRUD)',
                'departments' => 'Department management',
                'attendance' => 'Attendance tracking',
                'leaves' => 'Leave management',
                'payroll' => 'Payroll processing (integrates with Accounting)',
            ],
            'message' => 'HR module is planned for future development. Structure is ready for implementation.',
        ]);
    }
}
