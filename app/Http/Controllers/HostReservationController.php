<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\BookingService;
use App\Models\Booking;

class HostReservationController extends Controller
{
    protected BookingService $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    /**
     * Display the host's reservations page.
     */
    public function index(Request $request)
    {
        $tab = $request->query('tab', 'pending');
        if (!in_array($tab, ['pending', 'confirmed', 'history'])) {
            $tab = 'pending';
        }

        $userId = Auth::id() ?? 1;

        $bookings = $this->bookingService->getHostReservationsPaginated($userId, $tab);

        return Inertia::render('Host/Reservations/Index', [
            'bookings' => $bookings,
            'activeTab' => $tab,
        ]);
    }

    /**
     * Accept a booking.
     */
    public function accept(Request $request, $id)
    {
        $booking = Booking::whereHas('venue', function ($q) {
            $q->where('user_id', Auth::id() ?? 1);
        })->findOrFail($id);

        $request->validate([
            'host_message' => 'nullable|string|max:1000',
        ]);

        $this->bookingService->updateBookingStatus($booking, 'accepted_awaiting_payment', null, $request->host_message);

        return redirect()->back()->with('success', 'Réservation pré-acceptée avec succès.');
    }

    /**
     * Decline a booking.
     */
    public function decline(Request $request, $id)
    {
        $booking = Booking::whereHas('venue', function ($q) {
            $q->where('user_id', Auth::id() ?? 1);
        })->findOrFail($id);

        $request->validate([
            'decline_reason' => 'nullable|string|max:1000',
        ]);

        $this->bookingService->updateBookingStatus($booking, 'declined', $request->decline_reason);

        return redirect()->back()->with('success', 'Réservation refusée avec succès.');
    }
}
