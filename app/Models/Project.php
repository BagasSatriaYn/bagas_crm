<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'user_id',
        'lead_id',
        'status',
        'reject_reason',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function items()
    {
        return $this->hasMany(ProjectItem::class);
    }

    public function getTotalValueAttribute()
    {
        return $this->items->sum('negotiated_price');
    }

    public function getHasBelowMarginAttribute()
    {
        return $this->items->where('is_below_margin', true)->count() > 0;
    }
}
