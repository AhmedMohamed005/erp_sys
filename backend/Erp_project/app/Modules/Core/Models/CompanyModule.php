<?php

namespace App\Modules\Core\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\SoftDeleteWithUser;

class CompanyModule extends Model
{
    use HasFactory, SoftDeleteWithUser;

    protected $table = 'company_modules';

    protected $fillable = [
        'company_id',
        'module_id',
        'status'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}