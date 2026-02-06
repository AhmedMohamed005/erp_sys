<?php

namespace App\Http\Controllers;

use App\Modules\Core\Models\Company;
use App\Modules\Core\Models\Module;
use App\Modules\Core\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use App\Constants\Roles;

class SuperAdminController extends Controller
{
    /**
     * List all companies
     */
    public function listCompanies(Request $request)
    {
        $user = $request->user();
        
        // If not super admin, only return their own company
        if (!$user->isSuperAdmin()) {
            $companies = Company::with(['users', 'modules'])
                ->where('id', $user->company_id)
                ->get();
        } else {
            $companies = Company::with(['users', 'modules'])->get();
        }
        
        return response()->json([
            'companies' => $companies
        ]);
    }

    /**
     * Get a specific company by ID
     */
    public function showCompany(Request $request, $id)
    {
        $user = $request->user();
        
        // If user is not super admin, only allow viewing their own company
        if (!$user->isSuperAdmin() && $user->company_id != (int)$id) {
            return response()->json([
                'message' => 'Unauthorized to view this company'
            ], 403);
        }
        
        $company = Company::with(['users', 'modules'])->findOrFail($id);
        
        return response()->json([
            'company' => $company
        ]);
    }

    /**
     * Get the authenticated user's company
     */
    public function myCompany(Request $request)
    {
        $user = $request->user();
        $company = Company::with(['users', 'modules'])->findOrFail($user->company_id);
        
        return response()->json([
            'company' => $company
        ]);
    }

    /**
     * Create a new company with its first admin user
     */
    public function createCompany(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|string|email|max:255|unique:users,email',
            'admin_password' => ['required', 'confirmed', Password::defaults()],
            'modules' => 'nullable|array',
            'modules.*' => 'exists:modules,key',
        ]);

        try {
            DB::beginTransaction();

            // Create the company
            $company = Company::create([
                'name' => $validated['company_name'],
                'subdomain' => strtolower(str_replace(' ', '-', $validated['company_name'])),
                'is_active' => true,
            ]);

            // Create the admin user
            $user = User::create([
                'name' => $validated['admin_name'],
                'email' => $validated['admin_email'],
                'password' => Hash::make($validated['admin_password']),
                'company_id' => $company->id,
                'role' => Roles::ADMIN,
            ]);

            // Assign modules to the company if specified
            if (!empty($validated['modules'])) {
                $moduleIds = Module::whereIn('key', $validated['modules'])->pluck('id');

                $modulesData = [];
                foreach ($moduleIds as $moduleId) {
                    $modulesData[$moduleId] = ['status' => 'active'];
                }

                if (!empty($modulesData)) {
                    $company->modules()->attach($modulesData);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Company created successfully',
                'company' => $company->load(['users', 'modules']),
                'user' => $user->makeHidden(['password']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Company creation failed',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ], 500);
        }
    }

    /**
     * Toggle module status (activate/deactivate) for a company
     */
    public function toggleModule(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'module_key' => 'required|exists:modules,key',
            'status' => 'required|in:active,inactive',
        ]);

        try {
            $company = Company::findOrFail($validated['company_id']);
            $module = Module::where('key', $validated['module_key'])->firstOrFail();

            // Check if the pivot record exists, if not create it
            $existingPivot = DB::table('company_modules')
                ->where('company_id', $company->id)
                ->where('module_id', $module->id)
                ->first();

            if ($existingPivot) {
                // Update existing pivot
                $company->modules()->updateExistingPivot($module->id, [
                    'status' => $validated['status'],
                ]);
            } else {
                // Attach new module with status
                $company->modules()->attach($module->id, [
                    'status' => $validated['status'],
                ]);
            }

            return response()->json([
                'message' => 'Module status updated successfully',
                'company' => $company->load('modules'),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Module status update failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}