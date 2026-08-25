<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, \App\Traits\AutoBackupsDatabase, SoftDeletes;

    protected $fillable = [
        'user_id',
        'venue_id',
        'start_date',
        'end_date',
        'guest_count',
        'event_type',
        'total_price',
        'status',
        'special_requests',
        'decline_reason',
        'host_message',
        'amount_paid',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'total_price' => 'decimal:2',
        'amount_paid' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }
}
