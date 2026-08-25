<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\BookingService;
use App\Services\VenueAvailabilityService;
use App\Exceptions\BookingConflictException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    protected BookingService $bookingService;
    protected VenueAvailabilityService $availabilityService;

    /**
     * Injection de dépendances des services.
     */
    public function __construct(BookingService $bookingService, VenueAvailabilityService $availabilityService)
    {
        $this->bookingService = $bookingService;
        $this->availabilityService = $availabilityService;
    }

    public function index(Request $request)
    {
        $userId = Auth::id() ?? 1;

        // Bookings made by current user
        $myBookings = Booking::with(['venue.user'])
            ->where('user_id', $userId)
            ->latest()
            ->get();

        // Bookings received for venues owned by current user
        $receivedBookings = $this->bookingService->getReceivedBookings($userId, $request->query('status'));

        return Inertia::render('Bookings/Index', [
            'myBookings' => $myBookings,
            'receivedBookings' => $receivedBookings
        ]);
    }

    /**
     * Traite la soumission du formulaire de réservation.
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. Validation de la requête
        $validatedData = $request->validate([
            'venue_id' => 'required|exists:venues,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'guest_count' => 'required|integer|min:1',
            'event_type' => 'required|string',
            'special_requests' => 'nullable|string',
        ]);

        $venue = Venue::findOrFail($validatedData['venue_id']);
        $userId = Auth::id() ?? 1;

        try {
            // 2. Appel au service métier
            $booking = $this->bookingService->createBooking($validatedData, $venue, $userId);

            // 3. Notification (optionnel)
            $venue->user->notify(new \App\Notifications\BookingStatusUpdated($booking, "Nouvelle demande de réservation pour {$venue->title}."));

            // 4. Succès
            return redirect()->route('bookings.index')->with('success', __('Votre demande de réservation pour :venue a été transmise à l\'hôte !', ['venue' => $venue->title]));
        
        } catch (BookingConflictException $e) {
            // Interception de notre exception métier personnalisée
            return back()->withErrors([
                'start_date' => $e->getMessage()
            ])->withInput();
        
        } catch (\Exception $e) {
            // Interception des autres erreurs génériques
            Log::error("Erreur lors de la réservation : " . $e->getMessage());
            return back()->with('error', "Une erreur inattendue s'est produite lors de la réservation.")->withInput();
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $booking = Booking::with('venue')->findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,accepted_awaiting_payment,confirmed,cancelled,completed,declined',
            'decline_reason' => 'nullable|string',
            'host_message' => 'nullable|string',
        ]);

        $isHost = Auth::id() === $booking->venue->user_id;
        $isClient = Auth::id() === $booking->user_id;

        if (!$isHost && !$isClient) {
            return back()->with('error', 'Action non autorisée.');
        }

        if ($request->status === 'cancelled' && !$isClient) {
            return back()->with('error', 'Seul le client peut annuler sa réservation.');
        }

        if (in_array($request->status, ['accepted_awaiting_payment', 'confirmed', 'declined']) && !$isHost) {
            return back()->with('error', 'Seul l\'hôte peut confirmer ou refuser la réservation.');
        }

        $this->bookingService->updateBookingStatus($booking, $request->status, $request->decline_reason, $request->host_message);

        if ($request->status === 'confirmed') {
            $this->availabilityService->markDatesAsUnavailable(
                $booking->venue,
                $booking->id,
                $booking->start_date,
                $booking->end_date
            );
        }

        return back()->with('success', __('Le statut de la réservation #:id a été mis à jour (:status).', ['id' => $booking->id, 'status' => ucfirst($request->status)]));
    }

    /**
     * API endpoint to get unavailable dates for a venue.
     */
    public function checkAvailability($venueId)
    {
        $unavailableDates = $this->bookingService->getUnavailableDates($venueId);
        
        return response()->json([
            'unavailable_dates' => $unavailableDates
        ]);
    }
}
