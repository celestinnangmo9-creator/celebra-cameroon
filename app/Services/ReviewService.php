<?php

namespace App\Services;

use App\Models\Review;
use Illuminate\Support\Facades\Auth;

class ReviewService
{
    /**
     * Add a reply to a review as the owner of the venue.
     */
    public function replyToReview(Review $review, string $reply)
    {
        $review->update([
            'owner_reply' => $reply,
        ]);

        return $review;
    }
}
