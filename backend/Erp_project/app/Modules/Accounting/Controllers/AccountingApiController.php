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
}