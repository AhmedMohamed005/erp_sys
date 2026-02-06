<?php

namespace App\Modules\Accounting\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
use App\Traits\SoftDeleteWithUser;
use App\Modules\Accounting\Models\JournalEntryLine;

class Account extends Model
{
    use HasFactory, BelongsToTenant, SoftDeleteWithUser;

    protected $fillable = [
        'company_id',
        'code',
        'name',
        'type'
    ];

    const TYPES = [
        'Asset',
        'Liability',
        'Equity',
        'Revenue',
        'Expense'
    ];

    // Relationships
    public function journalEntryLines()
    {
        return $this->hasMany(JournalEntryLine::class);
    }
}