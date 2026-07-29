<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id() ?? 1;

        // Get all unique users with whom current user has exchanged messages
        $sentUserIds = Message::where('sender_id', $userId)->pluck('receiver_id');
        $receivedUserIds = Message::where('receiver_id', $userId)->pluck('sender_id');

        $contactIds = $sentUserIds->merge($receivedUserIds)->unique()->filter(fn($id) => $id != $userId);

        // If no contacts exist, add default hosts/clients
        if ($contactIds->isEmpty()) {
            $contactIds = User::where('id', '!=', $userId)->pluck('id');
        }

        $contacts = User::whereIn('id', $contactIds)->get();

        $activeContactId = $request->get('contact', $contacts->first()->id ?? 2);
        $activeContact = User::find($activeContactId) ?? $contacts->first();

        // Selected venue context if passed
        $selectedVenue = null;
        if ($request->filled('venue_id')) {
            $selectedVenue = Venue::find($request->venue_id);
        }

        // Fetch thread messages
        $messages = [];
        if ($activeContact) {
            $messages = Message::with(['sender', 'venue'])
                ->where(function($q) use ($userId, $activeContact) {
                    $q->where('sender_id', $userId)->where('receiver_id', $activeContact->id);
                })
                ->orWhere(function($q) use ($userId, $activeContact) {
                    $q->where('sender_id', $activeContact->id)->where('receiver_id', $userId);
                })
                ->orderBy('created_at', 'asc')
                ->get();
        }

        // Fetch appointments for this user
        $appointments = Appointment::with(['venue', 'host', 'user'])
            ->where('user_id', $userId)
            ->orWhere('host_id', $userId)
            ->latest()
            ->get();

        $allVenues = Venue::where('status', 'active')->get();

        return view('messages.index', compact('contacts', 'activeContact', 'messages', 'selectedVenue', 'appointments', 'allVenues'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'venue_id' => 'nullable|exists:venues,id',
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => Auth::id() ?? 1,
            'receiver_id' => $data['receiver_id'],
            'venue_id' => $data['venue_id'] ?? null,
            'content' => $data['content'],
            'is_read' => false,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => $message->load(['sender', 'venue']),
            ]);
        }

        return back()->with('success', 'Message envoyé !');
    }

    public function scheduleVisit(Request $request)
    {
        $data = $request->validate([
            'venue_id' => 'required|exists:venues,id',
            'scheduled_at' => 'required|date|after:now',
            'type' => 'required|in:physical_visit,video_call',
            'notes' => 'nullable|string',
        ]);

        $venue = Venue::findOrFail($data['venue_id']);

        $appointment = Appointment::create([
            'user_id' => Auth::id() ?? 1,
            'host_id' => $venue->user_id,
            'venue_id' => $venue->id,
            'scheduled_at' => $data['scheduled_at'],
            'type' => $data['type'],
            'status' => 'scheduled',
            'notes' => $data['notes'] ?? null,
        ]);

        // Send confirmation message in chat automatically
        Message::create([
            'sender_id' => Auth::id() ?? 1,
            'receiver_id' => $venue->user_id,
            'venue_id' => $venue->id,
            'content' => '📅 Demande de rendez-vous (' . ($data['type'] === 'physical_visit' ? 'Visite physique' : 'Appel Vidéo') . ') planifiée pour le ' . date('d/m/Y à H:i', strtotime($data['scheduled_at'])) . ' pour le lieu "' . $venue->title . '".',
            'is_read' => false,
        ]);

        return back()->with('success', 'Rendez-vous planifié avec succès ! L\'hôte en a été notifié.');
    }
}
