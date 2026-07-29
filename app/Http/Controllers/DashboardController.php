<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use App\Models\Booking;
use App\Models\Message;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id() ?? 1;

        $userVenues = Venue::where('user_id', $userId)->get();
        $venueIds = $userVenues->pluck('id');

        $totalVenues = $userVenues->count();

        $allBookings = Booking::whereIn('venue_id', $venueIds)->get();
        $totalBookings = $allBookings->count();
        $totalRevenue = $allBookings->where('status', 'confirmed')->sum('total_price');
        $pendingBookingsCount = $allBookings->where('status', 'pending')->count();

        $recentBookings = Booking::with(['venue', 'user'])
            ->whereIn('venue_id', $venueIds)
            ->latest()
            ->take(5)
            ->get();

        $upcomingAppointments = Appointment::with(['venue', 'user'])
            ->where('host_id', $userId)
            ->where('scheduled_at', '>=', now())
            ->orderBy('scheduled_at', 'asc')
            ->get();

        return Inertia::render('Dashboard', [
            'userVenues' => $userVenues,
            'totalVenues' => $totalVenues,
            'totalBookings' => $totalBookings,
            'totalRevenue' => $totalRevenue,
            'pendingBookingsCount' => $pendingBookingsCount,
            'recentBookings' => $recentBookings,
            'upcomingAppointments' => $upcomingAppointments,
            'userRole' => Auth::user()->role,
        ]);
    }
}
