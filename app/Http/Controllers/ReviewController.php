<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use App\Services\ReviewService;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    protected $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    public function store(Request $request, $venueId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:5|max:1000',
        ]);

        $venue = \App\Models\Venue::findOrFail($venueId);

        // Optionally, check if user has actually booked this venue before allowing review
        $hasBooked = \App\Models\Booking::where('venue_id', $venueId)
            ->where('user_id', Auth::id())
            ->exists();

        if (!$hasBooked) {
            return back()->with('error', 'Vous devez avoir réservé cet espace pour laisser un avis.');
        }

        $this->reviewService->createReview($venue, Auth::user(), $request->all());

        return back()->with('success', __('Votre avis a été publié avec succès.'));
    }

    public function reply(Request $request, $id)
    {
        $review = Review::with('venue')->findOrFail($id);

        if (Auth::id() !== $review->venue->user_id && !Auth::user()->isAdmin()) {
            return back()->with('error', 'Action non autorisée.');
        }

        $request->validate([
            'reply' => 'required|string|max:1000',
        ]);

        $this->reviewService->replyToReview($review, $request->reply);

        return back()->with('success', __('Votre réponse a été publiée avec succès.'));
    }
}

