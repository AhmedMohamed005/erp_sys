<?php

namespace App\Http\Controllers\Core;

use App\Http\Controllers\Controller;
use App\Modules\Core\Models\Company;
use App\Modules\Core\Models\Module;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use App\Constants\Roles;
class CompanyRegistrationController extends Controller
{
    /**
     * Register a new company with its first admin user
     */
    public function register(Request $request)
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
                'is_active' => true,
            ]);

            $user = User::create([
                'name' => $validated['admin_name'],
                'email' => $validated['admin_email'],
                'password' => Hash::make($validated['admin_password']),
                'company_id' => $company->id,
                'role' => Roles::ADMIN,
            ]);

            // Assign modules to the company
            if (!empty($validated['modules'])) {
                $moduleIds = Module::whereIn('key', $validated['modules'])->pluck('id');
                
                $modulesData = [];
                foreach ($moduleIds as $moduleId) {
                    $modulesData[$moduleId] = ['status' => 'active'];
                }
                
                $company->modules()->attach($modulesData);
            }

            DB::commit();

            return response()->json([
                'message' => 'Company registered successfully',
                'company' => $company,
                'user' => $user->makeHidden(['password']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Company registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Assign modules to a company
     */
    public function assignModules(Request $request, Company $company)
    {
        $validated = $request->validate([
            'modules' => 'required|array',
            'modules.*' => 'exists:modules,key',
        ]);

        try {
            $moduleIds = Module::whereIn('key', $validated['modules'])->pluck('id');
            
            $modulesData = [];
            foreach ($moduleIds as $moduleId) {
                $modulesData[$moduleId] = ['status' => 'active'];
            }
            
            $company->modules()->syncWithoutDetaching($modulesData);

            return response()->json([
                'message' => 'Modules assigned successfully',
                'company' => $company->load('modules'),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Module assignment failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Toggle module status (activate/deactivate)
     */
    public function toggleModule(Request $request, Company $company)
    {
        $validated = $request->validate([
            'module_key' => 'required|exists:modules,key',
            'status' => 'required|in:active,inactive',
        ]);

        try {
            $module = Module::where('key', $validated['module_key'])->firstOrFail();
            
            $company->modules()->updateExistingPivot($module->id, [
                'status' => $validated['status'],
            ]);

            return response()->json([
                'message' => 'Module status updated successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Module status update failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
