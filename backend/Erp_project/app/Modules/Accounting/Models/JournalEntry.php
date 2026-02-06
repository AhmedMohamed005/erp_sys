<?php

namespace App\Modules\Accounting\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
use App\Traits\SoftDeleteWithUser;
use \App\Modules\Core\Models\Company;

class JournalEntry extends Model
{
    use HasFactory, BelongsToTenant, SoftDeleteWithUser;

    protected $fillable = [
        'company_id',
        'date',
        'description',
        'reference_number',
        'source_type',
        'source_id',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    // Relationships
    public function lines()
    {
        return $this->hasMany(JournalEntryLine::class, 'entry_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function source()
    {
        return $this->morphTo();
    }

    /**
     * Validate that debits equal credits
     */
    public function validateBalance(): bool
    {
        $totalDebits = $this->lines()->sum('debit');
        $totalCredits = $this->lines()->sum('credit');

        return round($totalDebits, 2) === round($totalCredits, 2);
    }

    /**
     * Get total debits
     */
    public function getTotalDebitsAttribute(): float
    {
        return $this->lines()->sum('debit');
    }

    /**
     * Get total credits
     */
    public function getTotalCreditsAttribute(): float
    {
        return $this->lines()->sum('credit');
    }

    /**
     * Check if entry is balanced
     */
    public function getIsBalancedAttribute(): bool
    {
        return $this->validateBalance();
    }
}