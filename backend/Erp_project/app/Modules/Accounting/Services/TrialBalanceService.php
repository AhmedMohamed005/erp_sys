<?php

namespace App\Modules\Accounting\Services;

use App\Modules\Accounting\Models\Account;
use App\Modules\Accounting\Models\JournalEntryLine;
use Illuminate\Support\Facades\DB;

class TrialBalanceService
{
    /**
     * Generate trial balance for a company
     *
     * @param int $companyId
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    public function generate(int $companyId, ?string $startDate = null, ?string $endDate = null): array
    {
        $query = JournalEntryLine::withoutGlobalScopes()
            ->join('journal_entries', 'journal_entry_lines.entry_id', '=', 'journal_entries.id')
            ->join('accounts', 'journal_entry_lines.account_id', '=', 'accounts.id')
            ->where('journal_entries.company_id', $companyId)
            ->select(
                'accounts.id as account_id',
                'accounts.code',
                'accounts.name',
                'accounts.type',
                DB::raw('SUM(journal_entry_lines.debit) as total_debit'),
                DB::raw('SUM(journal_entry_lines.credit) as total_credit')
            )
            ->groupBy('accounts.id', 'accounts.code', 'accounts.name', 'accounts.type');

        // Apply date filters if provided
        if ($startDate) {
            $query->where('journal_entries.date', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('journal_entries.date', '<=', $endDate);
        }

        $results = $query->get();

        // Calculate balances
        $trialBalanceData = $results->map(function ($item) {
            $debit = (float) $item->total_debit;
            $credit = (float) $item->total_credit;
            $balance = $debit - $credit;

            return [
                'account_id' => $item->account_id,
                'code' => $item->code,
                'name' => $item->name,
                'type' => $item->type,
                'debit' => $debit,
                'credit' => $credit,
                'balance' => $balance,
                'balance_type' => $balance >= 0 ? 'debit' : 'credit',
            ];
        });

        // Calculate totals
        $totalDebit = $trialBalanceData->sum('debit');
        $totalCredit = $trialBalanceData->sum('credit');
        $isBalanced = round($totalDebit, 2) === round($totalCredit, 2);

        return [
            'accounts' => $trialBalanceData->values()->toArray(),
            'totals' => [
                'debit' => $totalDebit,
                'credit' => $totalCredit,
                'difference' => $totalDebit - $totalCredit,
                'is_balanced' => $isBalanced,
            ],
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ];
    }

    /**
     * Generate trial balance grouped by account type
     *
     * @param int $companyId
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    public function generateByType(int $companyId, ?string $startDate = null, ?string $endDate = null): array
    {
        $trialBalance = $this->generate($companyId, $startDate, $endDate);
        $accounts = collect($trialBalance['accounts']);

        $grouped = $accounts->groupBy('type')->map(function ($typeAccounts, $type) {
            return [
                'type' => $type,
                'accounts' => $typeAccounts->values()->toArray(),
                'total_debit' => $typeAccounts->sum('debit'),
                'total_credit' => $typeAccounts->sum('credit'),
            ];
        });

        return [
            'grouped_accounts' => $grouped->values()->toArray(),
            'totals' => $trialBalance['totals'],
            'period' => $trialBalance['period'],
        ];
    }
}
