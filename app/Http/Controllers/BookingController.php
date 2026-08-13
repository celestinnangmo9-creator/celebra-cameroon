<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Inertia\Inertia;
use App\Services\BookingService;

class BookingController extends Controller
{
    protected $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
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

    public function store(Request $request)
    {
        $data = $request->validate([
            'venue_id' => 'required|exists:venues,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'guest_count' => 'required|integer|min:1',
            'event_type' => 'required|string',
            'special_requests' => 'nullable|string',
        ]);

        $venue = Venue::findOrFail($data['venue_id']);

        // Check for overlapping using BookingService
        $unavailableDates = $this->bookingService->getUnavailableDates($venue->id);
        $period = CarbonPeriod::create($data['start_date'], $data['end_date']);
        
        $hasOverlap = false;
        foreach ($period as $date) {
            if (in_array($date->format('Y-m-d'), $unavailableDates)) {
                $hasOverlap = true;
                break;
            }
        }

        if ($hasOverlap) {
            return back()->withErrors(['start_date' => 'Ce lieu est déjà réservé ou indisponible à ces dates.'])->withInput();
        }

        $startDate = Carbon::parse($data['start_date']);
        $endDate = Carbon::parse($data['end_date']);
        $daysCount = max(1, $startDate->diffInDays($endDate) + 1);

        $totalPrice = $daysCount * $venue->price_per_day;

        $booking = Booking::create([
            'user_id' => Auth::id() ?? 1,
            'venue_id' => $venue->id,
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'guest_count' => $data['guest_count'],
            'event_type' => $data['event_type'],
            'total_price' => $totalPrice,
            'status' => 'pending',
            'special_requests' => $data['special_requests'] ?? null,
        ]);

        // Notify the host about the new booking
        $venue->user->notify(new \App\Notifications\BookingStatusUpdated($booking, "Nouvelle demande de réservation pour {$venue->title}."));

        return redirect()->route('bookings.index')->with('success', 'Votre demande de réservation pour ' . $venue->title . ' a été transmise à l\'hôte !');
    }

    public function updateStatus(Request $request, $id)
    {
        $booking = Booking::with('venue')->findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed,declined',
            'decline_reason' => 'nullable|string',
        ]);

        $isHost = Auth::id() === $booking->venue->user_id;
        $isClient = Auth::id() === $booking->user_id;

        if (!$isHost && !$isClient) {
            return back()->with('error', 'Action non autorisée.');
        }

        if ($request->status === 'cancelled' && !$isClient) {
            return back()->with('error', 'Seul le client peut annuler sa réservation.');
        }

        if (in_array($request->status, ['confirmed', 'declined']) && !$isHost) {
            return back()->with('error', 'Seul l\'hôte peut confirmer ou refuser la réservation.');
        }

        $this->bookingService->updateBookingStatus($booking, $request->status, $request->decline_reason);

        return back()->with('success', 'Le statut de la réservation #' . $booking->id . ' a été mis à jour (' . ucfirst($request->status) . ').');
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
