<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Venue;
use Illuminate\Support\Facades\Auth;
use App\Models\VenueBlockedDate;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class BookingService
{
    /**
     * Get bookings for a host (owner), optionally filtered by status.
     */
    public function getReceivedBookings(int $hostId, string $status = null)
    {
        $query = Booking::with(['venue', 'user'])
            ->whereHas('venue', function($q) use ($hostId) {
                $q->where('user_id', $hostId);
            })
            ->latest();

        if ($status) {
            $query->where('status', $status);
        }

        return $query->get();
    }

    /**
     * Update booking status (e.g., confirm or decline).
     */
    public function updateBookingStatus(Booking $booking, string $status, ?string $declineReason = null)
    {
        $booking->update([
            'status' => $status,
            'decline_reason' => $status === 'declined' ? $declineReason : null,
        ]);

        $message = match ($status) {
            'confirmed' => "Votre réservation pour {$booking->venue->title} a été confirmée.",
            'declined' => "Votre réservation pour {$booking->venue->title} a été refusée.",
            'cancelled' => "La réservation pour {$booking->venue->title} a été annulée.",
            'completed' => "Votre événement à {$booking->venue->title} est terminé. N'hésitez pas à laisser un avis !",
            default => "Le statut de votre réservation pour {$booking->venue->title} a été mis à jour.",
        };

        // Notify client or host based on who performed the action
        if ($status === 'cancelled') {
            $booking->venue->user->notify(new \App\Notifications\BookingStatusUpdated($booking, "Le client a annulé la réservation pour {$booking->venue->title}."));
        } else {
            $booking->user->notify(new \App\Notifications\BookingStatusUpdated($booking, $message));
        }

        return $booking;
    }

    /**
     * Get all unavailable dates (booked + blocked) for a venue as an array of strings ('Y-m-d').
     */
    public function getUnavailableDates(int $venueId): array
    {
        $unavailableDates = [];

        // 1. Get confirmed or pending bookings
        $bookings = Booking::where('venue_id', $venueId)
            ->whereIn('status', ['pending', 'confirmed'])
            ->get();

        foreach ($bookings as $booking) {
            $period = CarbonPeriod::create($booking->start_date, $booking->end_date);
            foreach ($period as $date) {
                $unavailableDates[] = $date->format('Y-m-d');
            }
        }

        // 2. Get manually blocked dates by the owner
        $blockedDates = VenueBlockedDate::where('venue_id', $venueId)->get();
        foreach ($blockedDates as $block) {
            $period = CarbonPeriod::create($block->start_date, $block->end_date);
            foreach ($period as $date) {
                $unavailableDates[] = $date->format('Y-m-d');
            }
        }

        // Remove duplicates and sort
        $unavailableDates = array_unique($unavailableDates);
        sort($unavailableDates);

        return $unavailableDates;
    }
}
