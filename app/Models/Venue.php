<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Venue extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'category',
        'region',
        'city',
        'district',
        'address',
        'capacity',
        'price_per_day',
        'price_per_hour',
        'description',
        'amenities',
        'main_image',
        'gallery_images',
        'status',
        'is_featured',
        'rating',
        'reviews_count',
    ];

    protected $casts = [
        'amenities' => 'array',
        'gallery_images' => 'array',
        'is_featured' => 'boolean',
        'price_per_day' => 'decimal:2',
        'price_per_hour' => 'decimal:2',
        'rating' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
