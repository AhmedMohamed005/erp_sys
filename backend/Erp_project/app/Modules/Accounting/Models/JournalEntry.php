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
        'reference_number'
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
}