<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Venue;

class HostVenueController extends Controller
{
    /**
     * Display a listing of the host's venues.
     */
    public function index()
    {
        $userId = Auth::id() ?? 1;

        $venues = Venue::withCount('bookings')
            ->where('user_id', $userId)
            ->latest()
            ->paginate(12);

        return Inertia::render('Host/Venues/Index', [
            'venues' => $venues,
        ]);
    }

    /**
     * Toggle the status of a venue (publish/unpublish).
     */
    public function toggleStatus(Request $request, $id)
    {
        $venue = Venue::where('user_id', Auth::id() ?? 1)->findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:active,draft,suspended',
        ]);

        $venue->status = $request->status;
        $venue->save();

        return redirect()->back()->with('success', 'Statut de la salle mis à jour avec succès.');
    }
}
