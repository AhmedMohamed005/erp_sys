<?php

namespace App\Modules\Core\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use App\Constants\Roles;

class User extends Authenticatable
{
    use Notifiable, SoftDeletes;

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'password',
        'role'
    ];
    protected $attributes = [
    'role' => Roles::USER,
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

    /**
     * Check if user is a super admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === Roles::SUPER_ADMIN;
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->role === Roles::ADMIN;
    }

    /**
     * Scope to filter users by company (tenant)
     */
    public function scopeTenantUsers(Builder $query, ?int $companyId = null): Builder
    {
        $companyId = $companyId ?? Auth::user()?->company_id;
        
        if ($companyId) {
            return $query->where('company_id', $companyId);
        }
        
        return $query;
    }
}