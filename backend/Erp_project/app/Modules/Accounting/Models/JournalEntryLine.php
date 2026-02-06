<?php

namespace App\Modules\Accounting\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
use App\Traits\SoftDeleteWithUser;
use App\Modules\Accounting\Models\JournalEntry;
use App\Modules\Accounting\Models\Account;

class JournalEntryLine extends Model
{
    use HasFactory, BelongsToTenant, SoftDeleteWithUser;

    protected $fillable = [
        'entry_id',
        'account_id',
        'debit',
        'credit'
    ];

    // Relationships
    public function journalEntry()
    {
        return $this->belongsTo(JournalEntry::class, 'entry_id');
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}