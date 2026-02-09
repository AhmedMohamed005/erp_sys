<?php

namespace App\Observers\Accounting;

use App\Modules\Accounting\Models\Invoice;
use App\Modules\Accounting\Models\JournalEntry;
use App\Modules\Accounting\Models\JournalEntryLine;
use App\Modules\Accounting\Models\Account;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InvoiceObserver
{
    /**
     * Handle the Invoice "created" event.
     */
    public function created(Invoice $invoice): void
    {
        // Only create journal entry if invoice is sent
        if ($invoice->status === 'sent') {
            $this->createJournalEntry($invoice);
        }
    }

    /**
     * Handle the Invoice "updated" event.
     */
    public function updated(Invoice $invoice): void
    {
        // If status changed to sent, create journal entry
        if ($invoice->wasChanged('status') && $invoice->status === 'sent') {
            
            // Check if journal entry doesn't already exist
            $existingEntry = JournalEntry::where('source_type', Invoice::class)
                ->where('source_id', $invoice->id)
                ->first();
            
            if (!$existingEntry) {
                $this->createJournalEntry($invoice);
            }
        }
    }

    /**
     * Create journal entry for invoice
     */
    protected function createJournalEntry(Invoice $invoice): void
    {
        try {
            DB::beginTransaction();

            // Get accounts (these should be configured per company)
            $receivableAccount = Account::where('company_id', $invoice->company_id)
                ->where('type', 'Asset')
                ->where(function($query) {
                    $query->where('code', 'LIKE', '%receivable%')
                          ->orWhere('name', 'LIKE', '%receivable%');
                })
                ->first();

            $revenueAccount = Account::where('company_id', $invoice->company_id)
                ->where('type', 'Revenue')
                ->first();

            if (!$receivableAccount || !$revenueAccount) {
                throw new \Exception('Required accounts not found for invoice journal entry');
            }

            // Create journal entry
            $journalEntry = JournalEntry::create([
                'company_id' => $invoice->company_id,
                'date' => now(),
                'description' => "Invoice #{$invoice->id} - {$invoice->client_name}",
                'reference_number' => "INV-{$invoice->id}",
                'source_type' => Invoice::class,
                'source_id' => $invoice->id,
            ]);

            // Debit: Accounts Receivable
            JournalEntryLine::create([
                'entry_id' => $journalEntry->id,
                'account_id' => $receivableAccount->id,
                'debit' => $invoice->total,
                'credit' => 0,
            ]);

            // Credit: Revenue
            JournalEntryLine::create([
                'entry_id' => $journalEntry->id,
                'account_id' => $revenueAccount->id,
                'debit' => 0,
                'credit' => $invoice->total,
            ]);

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Failed to create journal entry for invoice', ['exception' => $e, 'invoice_id' => $invoice->id]);
        }
    }
}
