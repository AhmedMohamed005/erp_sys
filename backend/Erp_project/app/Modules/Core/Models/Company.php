<?php

namespace App\Modules\Core\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\SoftDeleteWithUser;
use App\Modules\Core\Models\User;
class Company extends Model
{
    use HasFactory, SoftDeleteWithUser;

    protected $fillable = [
        'name',
        'subdomain',
        'is_active'
    ];

    // Define relationships
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function modules()
    {
        return $this->belongsToMany(\App\Modules\Core\Models\Module::class, 'company_modules')
                    ->withPivot('status')
                    ->withTimestamps();
    }
}