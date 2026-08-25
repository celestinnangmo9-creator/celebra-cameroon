<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\BookingService;

class ClientReservationController extends Controller
{
    protected BookingService $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    /**
     * Display the client's reservations page.
     */
    public function index(Request $request)
    {
        $tab = $request->query('tab', 'upcoming');
        if (!in_array($tab, ['upcoming', 'past', 'cancelled'])) {
            $tab = 'upcoming';
        }

        $userId = Auth::id() ?? 1;

        $bookings = $this->bookingService->getClientBookings($userId, $tab);

        return Inertia::render('Client/Reservations/Index', [
            'bookings' => $bookings,
            'activeTab' => $tab,
        ]);
    }
}
