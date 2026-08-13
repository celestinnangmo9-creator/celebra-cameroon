<?php

namespace App\Services;

use App\Models\Venue;
use Illuminate\Support\Str;

class VenueService
{
    /**
     * Create a new venue listing.
     *
     * @param array $data
     * @param int $userId
     * @param \Illuminate\Http\UploadedFile|null $mainImage
     * @param array $galleryImages
     * @return Venue
     */
    public function createVenue(array $data, int $userId, $mainImage = null, array $galleryImages = [])
    {
        $mainImagePath = '';
        if ($mainImage) {
            $path = $mainImage->store('venues', 'public');
            $mainImagePath = '/storage/' . $path;
        }

        $galleryPaths = [];
        if (!empty($galleryImages)) {
            foreach ($galleryImages as $file) {
                $path = $file->store('venues', 'public');
                $galleryPaths[] = '/storage/' . $path;
            }
        }

        return Venue::create([
            'user_id' => $userId,
            'title' => $data['title'],
            'slug' => Str::slug($data['title']) . '-' . rand(100, 999),
            'category' => $data['category'],
            'region' => $data['region'],
            'city' => $data['city'],
            'district' => $data['district'],
            'address' => $data['address'],
            'capacity' => $data['capacity'],
            'price_per_day' => $data['price_per_day'],
            'price_per_hour' => $data['price_per_hour'] ?? null,
            'description' => $data['description'],
            'amenities' => $data['amenities'] ?? [],
            'main_image' => $mainImagePath,
            'gallery_images' => $galleryPaths,
            'status' => 'active',
            'is_featured' => false,
            'rating' => 5.0,
            'reviews_count' => 0,
        ]);
    }

    /**
     * Update an existing venue.
     */
    public function updateVenue(Venue $venue, array $data, $mainImage = null, array $galleryImages = [])
    {
        $mainImagePath = $venue->main_image;
        if ($mainImage) {
            $path = $mainImage->store('venues', 'public');
            $mainImagePath = '/storage/' . $path;
        }

        $galleryPaths = $venue->gallery_images ?? [];
        if (!empty($galleryImages)) {
            foreach ($galleryImages as $file) {
                $path = $file->store('venues', 'public');
                $galleryPaths[] = '/storage/' . $path;
            }
        }

        $venue->update([
            'title' => $data['title'],
            'category' => $data['category'],
            'region' => $data['region'],
            'city' => $data['city'],
            'district' => $data['district'],
            'address' => $data['address'],
            'capacity' => $data['capacity'],
            'price_per_day' => $data['price_per_day'],
            'price_per_hour' => $data['price_per_hour'] ?? null,
            'description' => $data['description'],
            'amenities' => $data['amenities'] ?? [],
            'main_image' => $mainImagePath,
            'gallery_images' => $galleryPaths,
            'status' => $data['status'] ?? $venue->status,
        ]);

        return $venue;
    }

    /**
     * Delete a venue.
     * Soft deletes if bookings exist, hard deletes otherwise.
     */
    public function deleteVenue(Venue $venue)
    {
        if ($venue->bookings()->exists()) {
            $venue->delete();
        } else {
            $venue->forceDelete();
        }
    }

    /**
     * Get statistics for a venue
     */
    public function getVenueStats(Venue $venue)
    {
        $bookings = $venue->bookings;
        
        $totalBookings = $bookings->count();
        $confirmedBookings = $bookings->where('status', 'confirmed')->count();
        $totalRevenue = $bookings->where('status', 'confirmed')->sum('total_price');
        
        $bookingRate = $venue->views_count > 0 ? round(($totalBookings / $venue->views_count) * 100, 2) : 0;
        
        return [
            'views' => $venue->views_count,
            'total_bookings' => $totalBookings,
            'confirmed_bookings' => $confirmedBookings,
            'booking_rate' => $bookingRate,
            'revenue' => $totalRevenue,
            'average_rating' => $venue->rating,
        ];
    }
    
    /**
     * Block dates for a venue
     */
    public function blockDates(Venue $venue, array $data)
    {
        return $venue->blockedDates()->create([
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'reason' => $data['reason'] ?? null,
        ]);
    }
    
    /**
     * Unblock dates for a venue
     */
    public function unblockDate(Venue $venue, $blockedDateId)
    {
        return $venue->blockedDates()->where('id', $blockedDateId)->delete();
    }
}


