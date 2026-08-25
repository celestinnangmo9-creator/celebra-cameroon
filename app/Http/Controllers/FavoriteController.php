<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    /**
     * Display a listing of the user's favorite venues.
     */
    public function index()
    {
        $favorites = Favorite::with(['venue.reviews', 'venue.user'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Favorites/Index', [
            'favorites' => $favorites
        ]);
    }

    /**
     * Toggle favorite status for a venue.
     */
    public function toggle(Request $request, $venueId)
    {
        $venue = Venue::findOrFail($venueId);
        $user = Auth::user();

        $favorite = Favorite::where('user_id', $user->id)
            ->where('venue_id', $venue->id)
            ->first();

        if ($favorite) {
            $favorite->delete();
            return back()->with('success', __('Espace retiré de vos favoris.'));
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'venue_id' => $venue->id
            ]);
            return back()->with('success', __('Espace ajouté à vos favoris.'));
        }
    }
}
