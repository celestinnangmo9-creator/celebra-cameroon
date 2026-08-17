<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory, \App\Traits\AutoBackupsDatabase;

    protected $fillable = [
        'user_id',
        'host_id',
        'venue_id',
        'scheduled_at',
        'type',
        'status',
        'notes',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }
}
