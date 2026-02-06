<?php

namespace App\Modules\Core\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Traits\BelongsToTenant;
use App\Traits\SoftDeleteWithUser;

class User extends Authenticatable
{
    use Notifiable, BelongsToTenant, SoftDeleteWithUser;

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'password',
        'role'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Relationship to company
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}