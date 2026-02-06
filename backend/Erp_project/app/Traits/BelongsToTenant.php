<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use App\Modules\Core\Models\User;

trait BelongsToTenant
{
    /**
     * Boot the trait for a model.
     *
     * @return void
     */
    protected static function bootBelongsToTenant()
    {
        // Apply global scope for tenant filtering
        static::addGlobalScope('tenant', function (Builder $builder) {
            // Skip tenant filtering for super admins
            /** @var User|null $user */
            $user = Auth::user();
            if (!$user || ($user instanceof User && $user->isSuperAdmin())) {
                return;
            }

            if ($companyId = self::getCurrentCompanyId()) {
                $builder->where('company_id', $companyId);
            }
        });

        static::creating(function (Model $model) {
            // Skip auto-assignment for super admins creating records
            /** @var User|null $user */
            $user = Auth::user();
            if (!$user || ($user instanceof User && $user->isSuperAdmin())) {
                return;
            }

            if ($companyId = self::getCurrentCompanyId()) {
                $model->company_id = $companyId;
            }
        });

        static::updating(function (Model $model) {
            // Prevent changing company_id on updates
            $original = $model->getOriginal('company_id');
            $model->company_id = $original;
        });
    }

    /**
     * Get the current company_id from the authenticated user or context.
     *
     * @return int|null
     */
    protected static function getCurrentCompanyId(): ?int
    {
        if (Auth::check() && Auth::user()->company_id) {
            return Auth::user()->company_id;
        }

        return null;
    }

    /**
     * Scope to ignore tenant filtering.
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeWithoutTenant(Builder $query): Builder
    {
        return $query->withoutGlobalScope('tenant');
    }
}
