<?php

use Illuminate\Support\Facades\Route;
use App\Modules\HR\Controllers\HRApiController;

/*
|--------------------------------------------------------------------------
| HR Module API Routes
|--------------------------------------------------------------------------
|
| Routes for the HR module. All routes require authentication
| and the 'hr' module to be active for the user's company.
|
*/

Route::middleware(['auth:sanctum', 'module.access:hr'])->group(function () {
    // Module info
    Route::get('/hr/info', [HRApiController::class, 'info']);

    // Future: Employee management
    // Route::get('/hr/employees', [HRApiController::class, 'employees']);
    // Route::post('/hr/employees', [HRApiController::class, 'createEmployee']);
    // Route::get('/hr/employees/{id}', [HRApiController::class, 'showEmployee']);
    // Route::put('/hr/employees/{id}', [HRApiController::class, 'updateEmployee']);
    // Route::delete('/hr/employees/{id}', [HRApiController::class, 'destroyEmployee']);

    // Future: Department management
    // Route::get('/hr/departments', [HRApiController::class, 'departments']);
    // Route::post('/hr/departments', [HRApiController::class, 'createDepartment']);

    // Future: Attendance
    // Route::get('/hr/attendance', [HRApiController::class, 'attendance']);
    // Route::post('/hr/attendance', [HRApiController::class, 'recordAttendance']);

    // Future: Leaves
    // Route::get('/hr/leaves', [HRApiController::class, 'leaves']);
    // Route::post('/hr/leaves', [HRApiController::class, 'requestLeave']);
    // Route::patch('/hr/leaves/{id}/status', [HRApiController::class, 'updateLeaveStatus']);
});
