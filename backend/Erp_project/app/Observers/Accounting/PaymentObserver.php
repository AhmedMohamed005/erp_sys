<?php

namespace App\Observers\Accounting;

use App\Modules\Accounting\Models\Payment;
use App\Modules\Accounting\Models\JournalEntry;
use App\Modules\Accounting\Models\JournalEntryLine;
use App\Modules\Accounting\Models\Account;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentObserver
{
    /**
     * Handle the Payment "created" event.
     */
    public function created(Payment $payment): void
    {
        $this->createJournalEntry($payment);
    }

    /**
     * Create journal entry for payment
     */
    protected function createJournalEntry(Payment $payment): void
    {
        try {
            DB::beginTransaction();

            // Get accounts
            $cashAccount = Account::where('company_id', $payment->company_id)
                ->where('type', 'Asset')
                ->where(function($query) {
                    $query->where('code', 'LIKE', '%cash%')
                          ->orWhere('name', 'LIKE', '%cash%')
                          ->orWhere('code', 'LIKE', '%bank%')
                          ->orWhere('name', 'LIKE', '%bank%');
                })
                ->first();

            $receivableAccount = Account::where('company_id', $payment->company_id)
                ->where('type', 'Asset')
                ->where(function($query) {
                    $query->where('code', 'LIKE', '%receivable%')
                          ->orWhere('name', 'LIKE', '%receivable%');
                })
                ->first();

            if (!$cashAccount || !$receivableAccount) {
                throw new \Exception('Required accounts not found for payment journal entry');
            }

            // Create journal entry
            $description = "Payment #{$payment->id}";
            if ($payment->invoice_id) {
                $description .= " for Invoice #{$payment->invoice_id}";
            }

            $journalEntry = JournalEntry::create([
                'company_id' => $payment->company_id,
                'date' => $payment->payment_date,
                'description' => $description,
                'reference_number' => $payment->reference_number ?? "PAY-{$payment->id}",
                'source_type' => Payment::class,
                'source_id' => $payment->id,
            ]);

            // Debit: Cash/Bank
            JournalEntryLine::create([
                'entry_id' => $journalEntry->id,
                'account_id' => $cashAccount->id,
                'debit' => $payment->amount,
                'credit' => 0,
            ]);

            // Credit: Accounts Receivable
            JournalEntryLine::create([
                'entry_id' => $journalEntry->id,
                'account_id' => $receivableAccount->id,
                'debit' => 0,
                'credit' => $payment->amount,
            ]);

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Failed to create journal entry for payment', ['exception' => $e, 'payment_id' => $payment->id ?? null]);
        }
    }
}
