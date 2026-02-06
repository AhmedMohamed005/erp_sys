<?php

namespace App\Modules\Core\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\SoftDeleteWithUser;

class Module extends Model
{
    use HasFactory, SoftDeleteWithUser;

    protected $fillable = [
        'name',
        'key'
    ];

    // Relationship to companies
    public function companies()
    {
        return $this->belongsToMany(Company::class, 'company_modules')
                    ->withPivot('status')
                    ->withTimestamps();
    }
}