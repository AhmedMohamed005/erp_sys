<?php

namespace App\Modules\Accounting\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Accounting\Services\TrialBalanceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Modules\Core\Models\User;

class TrialBalanceController extends Controller
{
    protected $trialBalanceService;

    public function __construct(TrialBalanceService $trialBalanceService)
    {
        $this->trialBalanceService = $trialBalanceService;
    }

    /**
     * Get trial balance report
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'grouped' => 'nullable|boolean',
            'company_id' => 'nullable|integer|exists:companies,id',
        ]);

        /** @var User|null $user */
        $user = Auth::user();
        
        if ($user && $user->isSuperAdmin() && isset($validated['company_id'])) {
            $companyId = $validated['company_id'];
        } elseif ($user) {
            $companyId = $user->company_id;
        } else {
            $companyId = null;
        }

        if (!$companyId) {
            return response()->json([
                'message' => 'No company specified',
            ], 400);
        }

        $startDate = $validated['start_date'] ?? null;
        $endDate = $validated['end_date'] ?? null;
        $grouped = $validated['grouped'] ?? false;

        if ($grouped) {
            $trialBalance = $this->trialBalanceService->generateByType($companyId, $startDate, $endDate);
        } else {
            $trialBalance = $this->trialBalanceService->generate($companyId, $startDate, $endDate);
        }

        return response()->json($trialBalance);
    }
}
