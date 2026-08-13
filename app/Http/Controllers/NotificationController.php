<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Mark all unread notifications as read.
     */
    public function markAsRead()
    {
        Auth::user()->unreadNotifications->markAsRead();
        return back();
    }
}
