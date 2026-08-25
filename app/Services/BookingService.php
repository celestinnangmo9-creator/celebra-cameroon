<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Booking;
use App\Models\Venue;
use Illuminate\Support\Facades\Auth;
use App\Models\VenueBlockedDate;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use App\Exceptions\BookingConflictException;

class BookingService
{
    protected VenueAvailabilityService $availabilityService;

    /**
     * Injection de dépendance pour accéder au service de vérification des dates.
     */
    public function __construct(VenueAvailabilityService $availabilityService)
    {
        $this->availabilityService = $availabilityService;
    }

    /**
     * Vérifie la disponibilité de la salle aux dates souhaitées.
     *
     * @param Venue $venue
     * @param string $startDate
     * @param string $endDate
     * @return bool
     * @throws BookingConflictException
     */
    public function checkAvailability(Venue $venue, string $startDate, string $endDate): bool
    {
        $period = CarbonPeriod::create($startDate, $endDate);
        
        foreach ($period as $date) {
            $dateString = $date->format('Y-m-d');
            // Si la date est indisponible, on lève notre exception personnalisée
            if (!$this->availabilityService->isDateAvailable($venue, $dateString)) {
                throw new BookingConflictException("La date du {$date->format('d/m/Y')} vient d'être réservée par un autre client. Veuillez sélectionner une autre date.");
            }
        }

        return true;
    }

    /**
     * Traite et enregistre la réservation de manière sécurisée.
     *
     * @param array $data Les données validées issues de la requête
     * @param Venue $venue
     * @param int $userId L'utilisateur qui effectue la réservation
     * @return Booking
     * @throws BookingConflictException
     */
    public function createBooking(array $data, Venue $venue, int $userId): Booking
    {
        // 1. Vérifier la disponibilité (lève l'exception si conflit)
        $this->checkAvailability($venue, $data['start_date'], $data['end_date']);

        // 2. Calculer le prix total dynamiquement pour éviter la fraude côté frontend
        $startDate = Carbon::parse($data['start_date']);
        $endDate = Carbon::parse($data['end_date']);
        $daysCount = max(1, $startDate->diffInDays($endDate) + 1);
        $totalPrice = $daysCount * $venue->price_per_day;

        // 3. Persister la réservation
        $booking = Booking::create([
            'user_id' => $userId,
            'venue_id' => $venue->id,
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'guest_count' => $data['guest_count'],
            'event_type' => $data['event_type'],
            'total_price' => $totalPrice,
            'status' => 'pending',
            'special_requests' => $data['special_requests'] ?? null,
        ]);

        return $booking;
    }

    /**
     * Get bookings for a host (owner), optionally filtered by status.
     * 
     * @param int $hostId
     * @param string|null $status
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getReceivedBookings(int $hostId, ?string $status = null)
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
     *
     * @param Booking $booking
     * @param string $status
     * @param string|null $declineReason
     * @param string|null $hostMessage
     * @param float|null $amountPaid
     * @return Booking
     */
    public function updateBookingStatus(Booking $booking, string $status, ?string $declineReason = null, ?string $hostMessage = null, ?float $amountPaid = null): Booking
    {
        $updateData = [
            'status' => $status,
            'decline_reason' => $status === 'declined' ? $declineReason : null,
        ];

        if (in_array($status, ['accepted_awaiting_payment', 'confirmed']) && $hostMessage !== null) {
            $updateData['host_message'] = $hostMessage;
        }

        if ($amountPaid !== null) {
            $updateData['amount_paid'] = $amountPaid;
            if ($amountPaid >= ($booking->total_price / 2)) {
                $updateData['payment_status'] = $amountPaid >= $booking->total_price ? 'paid' : 'partially_paid';
            }
        }

        $booking->update($updateData);

        $message = match ($status) {
            'accepted_awaiting_payment' => "L'hôte a pré-accepté votre demande pour {$booking->venue->title}. Veuillez payer l'acompte de 50% pour confirmer.",
            'confirmed' => "Votre réservation pour {$booking->venue->title} est officiellement confirmée.",
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
     *
     * @param int $venueId
     * @return array
     */
    public function getUnavailableDates(int $venueId): array
    {
        $unavailableDates = [];

        // 1. Get confirmed bookings only (pending/accepted are not blocking)
        $bookings = Booking::where('venue_id', $venueId)
            ->where('status', 'confirmed')
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
