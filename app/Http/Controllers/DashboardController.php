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

        // Calcul des performances des salles
        $venuePerformances = $userVenues->map(function ($venue) use ($allBookings) {
            $venueBookings = $allBookings->where('venue_id', $venue->id);
            return [
                'id' => $venue->id,
                'title' => $venue->title,
                'city' => $venue->city,
                'bookings_count' => $venueBookings->count(),
                'revenue' => $venueBookings->where('status', 'confirmed')->sum('total_price')
            ];
        })->sortByDesc('revenue')->values()->take(5);

        // ----------------------------------------------------
        // DONNÉES DU CLIENT (LOCATAIRE)
        // ----------------------------------------------------
        $allClientBookings = Booking::with(['venue'])->where('user_id', $userId)->get();
        $clientTotalSpent = $allClientBookings->where('status', 'confirmed')->sum('total_price');
        $clientPendingCount = $allClientBookings->where('status', 'pending')->count();
        $clientRecentBookings = $allClientBookings->sortByDesc('created_at')->take(10)->values();

        $clientAppointments = Appointment::with(['venue'])
            ->where('user_id', $userId)
            ->where('scheduled_at', '>=', now())
            ->orderBy('scheduled_at', 'asc')
            ->get();

        return Inertia::render('Dashboard', [
            // Données Hôte
            'userVenues' => $userVenues,
            'totalVenues' => $totalVenues,
            'totalBookings' => $totalBookings,
            'totalRevenue' => $totalRevenue,
            'pendingBookingsCount' => $pendingBookingsCount,
            'recentBookings' => $recentBookings,
            'upcomingAppointments' => $upcomingAppointments,
            'venuePerformances' => $venuePerformances,
            // Données Client
            'clientTotalSpent' => $clientTotalSpent,
            'clientPendingCount' => $clientPendingCount,
            'clientRecentBookings' => $clientRecentBookings,
            'clientAppointments' => $clientAppointments,
            
            'userRole' => Auth::user()->role,
        ]);
    }
}
