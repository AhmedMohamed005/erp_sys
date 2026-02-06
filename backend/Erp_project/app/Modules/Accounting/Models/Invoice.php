<?php

namespace App\Modules\Accounting\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;
use App\Traits\SoftDeleteWithUser;

class Invoice extends Model
{
    use HasFactory, BelongsToTenant, SoftDeleteWithUser;

    protected $fillable = [
        'company_id',
        'client_name',
        'total',
        'status'
    ];

    // Relationships
    public function company()
    {
        return $this->belongsTo(\App\Modules\Core\Models\Company::class);
    }
}