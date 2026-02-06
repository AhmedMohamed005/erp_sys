<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait SoftDeleteWithUser
{
    use SoftDeletes;

    protected static function bootSoftDeleteWithUser()
    {
        static::deleting(function ($model) {
            if (Auth::check()) {
                $model->deleted_by = Auth::id();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(\App\Modules\Core\Models\User::class, 'deleted_by');
    }

    public function scopeWithTrashedBy(Builder $query, $userId)
    {
        return $query->withTrashed()->where('deleted_by', $userId);
    }

    public function scopeOnlyTrashedBy(Builder $query, $userId)
    {
        return $query->onlyTrashed()->where('deleted_by', $userId);
    }
}