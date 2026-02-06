<?php

namespace App\Modules\Accounting\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
use App\Traits\SoftDeleteWithUser;

class Payment extends Model
{
    use HasFactory, BelongsToTenant, SoftDeleteWithUser;

    protected $fillable = [
        'company_id',
        'invoice_id',
        'amount',
        'payment_date',
        'payment_method',
        'reference_number',
        'notes',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
    ];

    // Relationships
    public function company()
    {
        return $this->belongsTo(\App\Modules\Core\Models\Company::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function journalEntry()
    {
        return $this->morphOne(JournalEntry::class, 'source');
    }
}
