<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Venue extends Model
{
    use HasFactory, \App\Traits\AutoBackupsDatabase, SoftDeletes;

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
        'rejection_reason',
        'is_featured',
        'rating',
        'reviews_count',
        'views_count',
    ];

    protected $casts = [
        'amenities' => 'array',
        'gallery_images' => 'array',
        'is_featured' => 'boolean',
        'price_per_day' => 'decimal:2',
        'price_per_hour' => 'decimal:2',
        'rating' => 'float',
    ];

    protected function mainImage(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (!$value) return null;
                if (Str::startsWith($value, ['http://', 'https://', '/images/', '/storage/'])) {
                    return $value;
                }
                return Storage::url($value);
            }
        );
    }

    protected function galleryImages(): Attribute
    {
        return Attribute::make(
            get: function ($images) {
                if (!$images) return [];
                $images = is_array($images) ? $images : json_decode($images, true);
                return array_map(function ($img) {
                    if (Str::startsWith($img, ['http://', 'https://', '/images/', '/storage/'])) {
                        return $img;
                    }
                    return Storage::url($img);
                }, $images);
            }
        );
    }

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

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function blockedDates()
    {
        return $this->hasMany(VenueBlockedDate::class);
    }
}
