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

        // 30 days evolution for bookings
        $thirtyDaysAgo = now()->subDays(30);
        
        $bookingsEvolution = Booking::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy('date')
            ->orderBy('date')
            ->get();
            
        $revenueEvolution = Booking::selectRaw('DATE(created_at) as date, SUM(total_price) as revenue')
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->where('status', 'confirmed')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top 5 venues
        $topVenues = Venue::withCount(['bookings' => function($q) {
                $q->where('status', 'confirmed');
            }])
            ->orderByDesc('bookings_count')
            ->limit(5)
            ->get(['id', 'title', 'price_per_day']);

        return Inertia::render('Admin/Dashboard', [
            'kpis' => [
                'totalUsers' => $totalUsers,
                'totalVenues' => $totalVenues,
                'pendingVenues' => $pendingVenues,
                'totalBookings' => $totalBookings,
                'confirmedBookingsCount' => $confirmedBookingsCount,
                'totalRevenue' => $totalRevenue,
                'totalCommissions' => $totalCommissions,
            ],
            'chartData' => [
                'bookings' => $bookingsEvolution,
                'revenue' => $revenueEvolution,
            ],
            'topVenues' => $topVenues
        ]);
    }

    /**
     * Venues management
     */
    public function venues(Request $request)
    {
        $query = Venue::with('user:id,name,email')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $venues = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Venues', [
            'venues' => $venues,
            'filters' => $request->only(['status'])
        ]);
    }

    public function showVenue($id)
    {
        $venue = Venue::with(['user', 'reviews.user'])->findOrFail($id);

        return Inertia::render('Admin/VenueShow', [
            'venue' => $venue
        ]);
    }

    public function updateVenueStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected,suspended',
            'rejection_reason' => 'nullable|string'
        ]);

        $venue = Venue::findOrFail($id);
        $venue->status = $request->status;
        
        if ($request->status === 'rejected' || $request->status === 'suspended') {
            $venue->rejection_reason = $request->rejection_reason;
        } else {
            $venue->rejection_reason = null;
        }

        $venue->save();

        // Notifications can be implemented here later

        return back()->with('success', 'Statut de la salle mis à jour.');
    }

    /**
     * Users management
     */
    public function users(Request $request)
    {
        $query = User::withCount('venues', 'bookings')->latest();

        // Filters
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $request->only(['role', 'status', 'search'])
        ]);
    }

    public function showUser($id)
    {
        $user = User::with([
            'venues' => function($q) { $q->latest(); },
            'bookings' => function($q) { $q->with('venue')->latest(); }
        ])->findOrFail($id);

        return Inertia::render('Admin/UserShow', [
            'user' => $user
        ]);
    }

    public function updateUserStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'nullable|in:active,blocked',
            'role' => 'nullable|in:client,owner,admin'
        ]);

        $user = User::findOrFail($id);
        
        // Prevent admin from modifying their own critical data here
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'Vous ne pouvez pas modifier votre propre compte ici.']);
        }

        if ($request->filled('status')) {
            $user->status = $request->status;
        }
        if ($request->filled('role')) {
            $user->role = $request->role;
        }
        
        $user->save();

        return back()->with('success', 'Utilisateur mis à jour avec succès.');
    }

    public function destroyUser($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'Vous ne pouvez pas supprimer votre propre compte.']);
        }

        // Soft delete the user
        $user->delete();

        return redirect()->route('admin.users')->with('success', 'Utilisateur supprimé (soft delete) avec succès.');
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

    /**
     * Settings management
     */
    public function settings(\App\Services\SettingService $settingService)
    {
        $settings = array_merge(
            $settingService->getDefaults(),
            $settingService->all()
        );

        return Inertia::render('Admin/Settings', [
            'settings' => $settings
        ]);
    }

    public function updateSettings(Request $request, \App\Services\SettingService $settingService)
    {
        $validated = $request->validate([
            'commission_percentage' => 'required|numeric|min:0|max:100',
            'maintenance_mode' => 'required|boolean',
            'payment_orange_money_active' => 'required|boolean',
            'payment_mtn_momo_active' => 'required|boolean',
        ]);

        $settingService->update([
            'commission_percentage' => (string) $validated['commission_percentage'],
            'maintenance_mode' => $validated['maintenance_mode'] ? '1' : '0',
            'payment_orange_money_active' => $validated['payment_orange_money_active'] ? '1' : '0',
            'payment_mtn_momo_active' => $validated['payment_mtn_momo_active'] ? '1' : '0',
        ]);

        return back()->with('success', 'Paramètres mis à jour avec succès.');
    }
}
