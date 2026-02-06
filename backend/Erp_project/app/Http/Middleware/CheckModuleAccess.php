<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Modules\Core\Models\Module;
use Symfony\Component\HttpFoundation\Response;

class CheckModuleAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $moduleKey): Response
    {
        if (!Auth::check()) {
            abort(403, 'Authentication required');
        }

        $user = Auth::user();
        $companyId = $user->company_id;

        // Find the module by its key
        $module = Module::where('key', $moduleKey)->first();

        if (!$module) {
            abort(404, 'Module not found');
        }

        // Check if the company has access to this module
        $companyModule = $user->company->modules()
            ->where('modules.id', $module->id)
            ->first();

        if (!$companyModule || $companyModule->pivot->status !== 'active') {
            abort(403, 'Module not enabled for this workspace');
        }

        return $next($request);
    }
}
