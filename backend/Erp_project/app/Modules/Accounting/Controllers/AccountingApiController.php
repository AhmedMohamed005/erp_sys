<?php

namespace App\Modules\Accounting\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Accounting\Models\Account;
use App\Modules\Accounting\Models\JournalEntry;
use App\Modules\Accounting\Models\JournalEntryLine;
use App\Modules\Accounting\Models\Invoice;
use App\Modules\Accounting\Models\Payment;
use App\Modules\Accounting\Services\TrialBalanceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AccountingApiController extends Controller
{
    protected $trialBalanceService;

    public function __construct(TrialBalanceService $trialBalanceService)
    {
        $this->trialBalanceService = $trialBalanceService;
    }

    /**
     * Get all accounts for the authenticated user's company
     */
    public function accounts(Request $request)
    {
        $accounts = Account::all();

        return response()->json([
            'accounts' => $accounts
        ]);
    }

    /**
     * Create a new account
     */
    public function createAccount(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:accounts,code',
            'name' => 'required|string|max:255',
            'type' => ['required', Rule::in(Account::TYPES)]
        ]);

        $account = Account::create($validated);

        return response()->json([
            'account' => $account
        ], 201);
    }

    /**
     * Get all journal entries for the authenticated user's company
     */
    public function journalEntries(Request $request)
    {
        $entries = JournalEntry::with(['lines.account', 'lines.journalEntry'])->get();

        return response()->json([
            'journal_entries' => $entries
        ]);
    }

    /**
     * Create a new journal entry with lines
     */
    public function createJournalEntry(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'description' => 'required|string|max:255',
            'reference_number' => 'nullable|string|max:255',
            'lines' => 'required|array|min:1',
            'lines.*.account_id' => 'required|exists:accounts,id',
            'lines.*.debit' => 'required|numeric|min:0',
            'lines.*.credit' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            // Create the journal entry
            $entry = JournalEntry::create([
                'date' => $validated['date'],
                'description' => $validated['description'],
                'reference_number' => $validated['reference_number'] ?? null,
            ]);

            // Create journal entry lines
            foreach ($validated['lines'] as $line) {
                // Validate that either debit or credit is set, but not both
                if (($line['debit'] > 0) && ($line['credit'] > 0)) {
                    throw new \Exception('A line cannot have both debit and credit amounts');
                }
                
                if (($line['debit'] == 0) && ($line['credit'] == 0)) {
                    throw new \Exception('A line must have either debit or credit amount');
                }

                JournalEntryLine::create([
                    'entry_id' => $entry->id,
                    'account_id' => $line['account_id'],
                    'debit' => $line['debit'],
                    'credit' => $line['credit'],
                ]);
            }

            // Validate that the entry is balanced
            if (!$entry->is_balanced) {
                throw new \Exception('Journal entry must be balanced (debits must equal credits)');
            }

            DB::commit();

            return response()->json([
                'journal_entry' => $entry->fresh(['lines.account'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Failed to create journal entry',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Get all invoices for the authenticated user's company
     */
    public function invoices(Request $request)
    {
        $invoices = Invoice::all();

        return response()->json([
            'invoices' => $invoices
        ]);
    }

    /**
     * Create a new invoice
     */
    public function createInvoice(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'total' => 'required|numeric|min:0',
            'status' => ['required', Rule::in(['draft', 'sent', 'paid', 'overdue', 'cancelled'])]
        ]);

        $invoice = Invoice::create($validated);

        return response()->json([
            'invoice' => $invoice
        ], 201);
    }

    /**
     * Get all payments for the authenticated user's company
     */
    public function payments(Request $request)
    {
        $payments = Payment::with('invoice')->get();

        return response()->json([
            'payments' => $payments
        ]);
    }

    /**
     * Create a new payment
     */
    public function createPayment(Request $request)
    {
        $validated = $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string|max:255',
            'reference_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:500',
        ]);

        // Verify that the payment amount doesn't exceed the invoice total
        $invoice = Invoice::findOrFail($validated['invoice_id']);
        if ($validated['amount'] > $invoice->total) {
            return response()->json([
                'message' => 'Payment amount exceeds invoice total',
            ], 422);
        }

        $payment = Payment::create($validated);

        return response()->json([
            'payment' => $payment->fresh('invoice')
        ], 201);
    }

    /**
     * Get trial balance report
     */
    public function trialBalance(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'grouped' => 'nullable|in:true,false,1,0'
        ]);

        $startDate = $validated['start_date'] ?? null;
        $endDate = $validated['end_date'] ?? null;
        $grouped = filter_var($validated['grouped'] ?? false, FILTER_VALIDATE_BOOLEAN);

        if ($grouped) {
            $trialBalance = $this->trialBalanceService->generateByType(
                Auth::user()->company_id,
                $startDate,
                $endDate
            );
        } else {
            $trialBalance = $this->trialBalanceService->generate(
                Auth::user()->company_id,
                $startDate,
                $endDate
            );
        }

        return response()->json($trialBalance);
    }

    /**
     * Get account ledger (all journal lines for a specific account)
     */
    public function accountLedger(Request $request, $accountId)
    {
        $account = Account::findOrFail($accountId);

        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $query = JournalEntryLine::with(['journalEntry'])
            ->where('account_id', $accountId)
            ->join('journal_entries', 'journal_entry_lines.entry_id', '=', 'journal_entries.id')
            ->select('journal_entry_lines.*', 'journal_entries.date', 'journal_entries.description as entry_description', 'journal_entries.reference_number')
            ->orderBy('journal_entries.date', 'asc');

        if (!empty($validated['start_date'])) {
            $query->where('journal_entries.date', '>=', $validated['start_date']);
        }

        if (!empty($validated['end_date'])) {
            $query->where('journal_entries.date', '<=', $validated['end_date']);
        }

        $lines = $query->get();

        $totalDebit = $lines->sum('debit');
        $totalCredit = $lines->sum('credit');

        return response()->json([
            'account' => $account,
            'ledger' => $lines,
            'totals' => [
                'debit' => $totalDebit,
                'credit' => $totalCredit,
                'balance' => $totalDebit - $totalCredit,
            ],
        ]);
    }

    /**
     * Get a single invoice with its related journal entry and payments
     */
    public function showInvoice(Request $request, $id)
    {
        $invoice = Invoice::with(['journalEntry.lines.account', 'payments'])->findOrFail($id);

        return response()->json([
            'invoice' => $invoice,
            'has_journal_entry' => $invoice->journalEntry !== null,
            'total_paid' => $invoice->payments->sum('amount'),
            'remaining_balance' => $invoice->total - $invoice->payments->sum('amount'),
        ]);
    }

    /**
     * Update invoice status (triggers automatic journal entry if status becomes 'sent')
     */
    public function updateInvoiceStatus(Request $request, $id)
    {
        $invoice = Invoice::findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', Rule::in(['draft', 'sent', 'paid', 'overdue', 'cancelled'])]
        ]);

        $invoice->update(['status' => $validated['status']]);

        return response()->json([
            'invoice' => $invoice->fresh(['journalEntry.lines.account', 'payments']),
            'message' => 'Invoice status updated successfully',
            'journal_entry_created' => $invoice->journalEntry !== null,
        ]);
    }

    /**
     * Get a single journal entry with validation info
     */
    public function showJournalEntry(Request $request, $id)
    {
        $entry = JournalEntry::with(['lines.account'])->findOrFail($id);

        return response()->json([
            'journal_entry' => $entry,
            'validation' => [
                'total_debits' => $entry->total_debits,
                'total_credits' => $entry->total_credits,
                'is_balanced' => $entry->is_balanced,
                'difference' => $entry->total_debits - $entry->total_credits,
            ],
        ]);
    }

    /**
     * Get income statement (Revenue - Expenses)
     */
    public function incomeStatement(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $companyId = Auth::user()->company_id;
        $startDate = $validated['start_date'] ?? null;
        $endDate = $validated['end_date'] ?? null;

        $query = JournalEntryLine::withoutGlobalScopes()
            ->join('journal_entries', 'journal_entry_lines.entry_id', '=', 'journal_entries.id')
            ->join('accounts', 'journal_entry_lines.account_id', '=', 'accounts.id')
            ->where('journal_entries.company_id', $companyId)
            ->whereIn('accounts.type', ['Revenue', 'Expense'])
            ->select(
                'accounts.id as account_id',
                'accounts.code',
                'accounts.name',
                'accounts.type',
                DB::raw('SUM(journal_entry_lines.debit) as total_debit'),
                DB::raw('SUM(journal_entry_lines.credit) as total_credit')
            )
            ->groupBy('accounts.id', 'accounts.code', 'accounts.name', 'accounts.type');

        if ($startDate) {
            $query->where('journal_entries.date', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('journal_entries.date', '<=', $endDate);
        }

        $results = $query->get();

        $revenue = $results->where('type', 'Revenue')->map(function ($item) {
            return [
                'account_id' => $item->account_id,
                'code' => $item->code,
                'name' => $item->name,
                'amount' => (float) $item->total_credit - (float) $item->total_debit,
            ];
        })->values();

        $expenses = $results->where('type', 'Expense')->map(function ($item) {
            return [
                'account_id' => $item->account_id,
                'code' => $item->code,
                'name' => $item->name,
                'amount' => (float) $item->total_debit - (float) $item->total_credit,
            ];
        })->values();

        $totalRevenue = $revenue->sum('amount');
        $totalExpenses = $expenses->sum('amount');

        return response()->json([
            'revenue' => $revenue,
            'expenses' => $expenses,
            'totals' => [
                'total_revenue' => $totalRevenue,
                'total_expenses' => $totalExpenses,
                'net_income' => $totalRevenue - $totalExpenses,
            ],
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    /**
     * Get balance sheet (Assets = Liabilities + Equity)
     */
    public function balanceSheet(Request $request)
    {
        $validated = $request->validate([
            'as_of_date' => 'nullable|date',
        ]);

        $companyId = Auth::user()->company_id;
        $asOfDate = $validated['as_of_date'] ?? now()->toDateString();

        $query = JournalEntryLine::withoutGlobalScopes()
            ->join('journal_entries', 'journal_entry_lines.entry_id', '=', 'journal_entries.id')
            ->join('accounts', 'journal_entry_lines.account_id', '=', 'accounts.id')
            ->where('journal_entries.company_id', $companyId)
            ->where('journal_entries.date', '<=', $asOfDate)
            ->whereIn('accounts.type', ['Asset', 'Liability', 'Equity'])
            ->select(
                'accounts.id as account_id',
                'accounts.code',
                'accounts.name',
                'accounts.type',
                DB::raw('SUM(journal_entry_lines.debit) as total_debit'),
                DB::raw('SUM(journal_entry_lines.credit) as total_credit')
            )
            ->groupBy('accounts.id', 'accounts.code', 'accounts.name', 'accounts.type');

        $results = $query->get();

        $mapAccount = function ($item) {
            $balance = (float) $item->total_debit - (float) $item->total_credit;
            if ($item->type !== 'Asset') {
                $balance = -$balance; // Liabilities and Equity have credit balances
            }
            return [
                'account_id' => $item->account_id,
                'code' => $item->code,
                'name' => $item->name,
                'balance' => $balance,
            ];
        };

        $assets = $results->where('type', 'Asset')->map($mapAccount)->values();
        $liabilities = $results->where('type', 'Liability')->map($mapAccount)->values();
        $equity = $results->where('type', 'Equity')->map($mapAccount)->values();

        $totalAssets = $assets->sum('balance');
        $totalLiabilities = $liabilities->sum('balance');
        $totalEquity = $equity->sum('balance');

        return response()->json([
            'assets' => $assets,
            'liabilities' => $liabilities,
            'equity' => $equity,
            'totals' => [
                'total_assets' => $totalAssets,
                'total_liabilities' => $totalLiabilities,
                'total_equity' => $totalEquity,
                'liabilities_plus_equity' => $totalLiabilities + $totalEquity,
                'is_balanced' => round($totalAssets, 2) === round($totalLiabilities + $totalEquity, 2),
            ],
            'as_of_date' => $asOfDate,
        ]);
    }
}