<?php

namespace App\Http\Controllers\Core;

use App\Http\Controllers\Controller;
use App\Modules\Core\Models\User;
use App\Modules\Core\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;
use App\Constants\Roles;

class UserController extends Controller
{
    /**
     * Get all users (filtered by company for non-super admins)
     */
    public function index(Request $request)
    {
        $authUser = $request->user();
        
        // If super admin, return all users. Otherwise, only company users
        if ($authUser->isSuperAdmin()) {
            $users = User::with('company')->get();
        } else {
            $users = User::with('company')
                ->where('company_id', $authUser->company_id)
                ->get();
        }
        
        return response()->json([
            'users' => $users
        ]);
    }

    /**
     * Get a specific user by ID
     */
    public function show(Request $request, $id)
    {
        $authUser = $request->user();
        $user = User::with('company')->findOrFail($id);
        
        // Check authorization: super admin can view any user, others only their company users
        if (!$authUser->isSuperAdmin() && $user->company_id != $authUser->company_id) {
            return response()->json([
                'message' => 'Unauthorized to view this user'
            ], 403);
        }
        
        return response()->json([
            'user' => $user
        ]);
    }

    /**
     * Create a new user
     */
    public function store(Request $request)
    {
        $authUser = $request->user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', Rule::in([Roles::USER, Roles::ADMIN, Roles::SUPER_ADMIN])],
            'company_id' => 'required|exists:companies,id',
        ]);

        // Authorization check: non-super admins can only create users in their own company
        if (!$authUser->isSuperAdmin() && $validated['company_id'] != $authUser->company_id) {
            return response()->json([
                'message' => 'Unauthorized to create users for this company'
            ], 403);
        }

        // Only super admins can create super admins
        if ($validated['role'] === Roles::SUPER_ADMIN && !$authUser->isSuperAdmin()) {
            return response()->json([
                'message' => 'Only super admins can create super admin users'
            ], 403);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'company_id' => $validated['company_id'],
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user->load('company')
        ], 201);
    }

    /**
     * Update an existing user
     */
    public function update(Request $request, $id)
    {
        $authUser = $request->user();
        $user = User::findOrFail($id);

        // Authorization check
        if (!$authUser->isSuperAdmin() && $user->company_id != $authUser->company_id) {
            return response()->json([
                'message' => 'Unauthorized to update this user'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($id)],
            'password' => ['sometimes', 'confirmed', Password::defaults()],
            'role' => ['sometimes', 'required', Rule::in([Roles::USER, Roles::ADMIN, Roles::SUPER_ADMIN])],
            'company_id' => 'sometimes|required|exists:companies,id',
        ]);

        // Non-super admins cannot change company_id
        if (isset($validated['company_id']) && !$authUser->isSuperAdmin() && $validated['company_id'] != $authUser->company_id) {
            return response()->json([
                'message' => 'Unauthorized to move users to another company'
            ], 403);
        }

        // Only super admins can promote users to super admin
        if (isset($validated['role']) && $validated['role'] === Roles::SUPER_ADMIN && !$authUser->isSuperAdmin()) {
            return response()->json([
                'message' => 'Only super admins can promote users to super admin'
            ], 403);
        }

        // Update password if provided
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->fresh('company')
        ]);
    }

    /**
     * Delete a user (soft delete)
     */
    public function destroy(Request $request, $id)
    {
        $authUser = $request->user();
        $user = User::findOrFail($id);

        // Authorization check
        if (!$authUser->isSuperAdmin() && $user->company_id != $authUser->company_id) {
            return response()->json([
                'message' => 'Unauthorized to delete this user'
            ], 403);
        }

        // Prevent self-deletion
        if ($user->id === $authUser->id) {
            return response()->json([
                'message' => 'You cannot delete your own account'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }
}
