<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Venue;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Dashboard view for Admin
     */
    public function index()
    {
        $totalUsers = User::count();
        $totalVenues = Venue::count();
        $pendingVenues = Venue::where('status', 'pending')->count();
        $totalBookings = Booking::count();
        $confirmedBookingsCount = Booking::where('status', 'confirmed')->count();
        
        $totalRevenue = Booking::where('status', 'confirmed')->sum('total_price');
        // Suppose the platform takes a 10% commission
        $totalCommissions = $totalRevenue * 0.10;

        return Inertia::render('Admin/Dashboard', [
            'kpis' => [
                'totalUsers' => $totalUsers,
                'totalVenues' => $totalVenues,
                'pendingVenues' => $pendingVenues,
                'totalBookings' => $totalBookings,
                'confirmedBookingsCount' => $confirmedBookingsCount,
                'totalRevenue' => $totalRevenue,
                'totalCommissions' => $totalCommissions,
            ]
        ]);
    }

    /**
     * Venues management
     */
    public function venues()
    {
        $venues = Venue::with('user:id,name,email')->latest()->paginate(20);
        return Inertia::render('Admin/Venues', [
            'venues' => $venues
        ]);
    }

    public function updateVenueStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $venue = Venue::findOrFail($id);
        $venue->status = $request->status;
        $venue->save();

        return back()->with('success', 'Statut de la salle mis à jour.');
    }

    /**
     * Users management
     */
    public function users()
    {
        $users = User::withCount('venues', 'bookings')->latest()->paginate(20);
        return Inertia::render('Admin/Users', [
            'users' => $users
        ]);
    }

    public function updateUserStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,blocked'
        ]);

        $user = User::findOrFail($id);
        
        // Prevent admin from blocking themselves
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'Vous ne pouvez pas vous bloquer vous-même.']);
        }

        $user->status = $request->status;
        $user->save();

        return back()->with('success', 'Statut de l\'utilisateur mis à jour.');
    }

    /**
     * Transactions management
     */
    public function transactions()
    {
        $bookings = Booking::with(['venue:id,title', 'user:id,name,email'])
                           ->latest()
                           ->paginate(20);
                           
        return Inertia::render('Admin/Transactions', [
            'bookings' => $bookings
        ]);
    }
}
