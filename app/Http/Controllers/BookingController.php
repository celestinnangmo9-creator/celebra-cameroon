<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class BookingController extends Controller
{
    public function index()
    {
        $userId = Auth::id() ?? 1;

        // Bookings made by current user
        $myBookings = Booking::with(['venue.user'])
            ->where('user_id', $userId)
            ->latest()
            ->get();

        // Bookings received for venues owned by current user
        $receivedBookings = Booking::with(['venue', 'user'])
            ->whereHas('venue', function($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->latest()
            ->get();

        return view('bookings.index', compact('myBookings', 'receivedBookings'));
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

        // Check for overlapping bookings
        $hasOverlap = Booking::where('venue_id', $venue->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) use ($data) {
                $query->whereBetween('start_date', [$data['start_date'], $data['end_date']])
                      ->orWhereBetween('end_date', [$data['start_date'], $data['end_date']])
                      ->orWhere(function ($q) use ($data) {
                          $q->where('start_date', '<=', $data['start_date'])
                            ->where('end_date', '>=', $data['end_date']);
                      });
            })
            ->exists();

        if ($hasOverlap) {
            return back()->withErrors(['start_date' => 'Ce lieu est déjà réservé à ces dates.'])->withInput();
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

        // Dispatch background job to send email
        \App\Jobs\SendBookingNotification::dispatch($booking);

        return redirect()->route('bookings.index')->with('success', 'Votre demande de réservation pour ' . $venue->title . ' a été transmise à l\'hôte !');
    }

    public function updateStatus(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
        ]);

        $booking->update([
            'status' => $request->status,
        ]);

        return back()->with('success', 'Le statut de la réservation #' . $booking->id . ' a été mis à jour (' . ucfirst($request->status) . ').');
    }
}
