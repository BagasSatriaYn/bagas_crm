<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'base_price',
        'margin_percentage',
        'selling_price',
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($product) {
            $product->selling_price = $product->base_price + ($product->base_price * $product->margin_percentage / 100);
        });
    }

    public function projectItems()
    {
        return $this->hasMany(ProjectItem::class);
    }

    public function customerServices()
    {
        return $this->hasMany(CustomerService::class);
    }
}
