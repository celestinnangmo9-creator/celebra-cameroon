<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'price',
        'max_venues',
        'is_featured',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'max_venues' => 'integer',
        'is_featured' => 'boolean',
    ];
}
