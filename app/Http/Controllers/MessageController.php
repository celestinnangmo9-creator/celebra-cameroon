<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Events\MessageSent;
use App\Events\UnreadMessageNotification;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id() ?? 1;

        $sentUserIds = Message::where('sender_id', $userId)->pluck('receiver_id');
        $receivedUserIds = Message::where('receiver_id', $userId)->pluck('sender_id');

        $contactIds = $sentUserIds->merge($receivedUserIds)->unique()->filter(fn($id) => $id != $userId);

        if ($contactIds->isEmpty()) {
            $contactIds = User::where('id', '!=', $userId)->pluck('id');
        }

        $contacts = User::whereIn('id', $contactIds)->get();

        $activeContactId = $request->get('contact');
        $activeContact = $activeContactId ? User::find($activeContactId) : null;

        $selectedVenue = null;
        if ($request->filled('venue_id')) {
            $selectedVenue = Venue::find($request->venue_id);
        }

        $messages = [];
        if ($activeContact) {
            $messages = Message::with(['sender', 'venue'])
                ->where(function ($q) use ($userId, $activeContact) {
                    $q->where('sender_id', $userId)->where('receiver_id', $activeContact->id);
                })
                ->orWhere(function ($q) use ($userId, $activeContact) {
                    $q->where('sender_id', $activeContact->id)->where('receiver_id', $userId);
                })
                ->orderBy('created_at', 'asc')
                ->get();
        }

        $appointments = Appointment::with(['venue', 'host', 'user'])
            ->where('user_id', $userId)
            ->orWhere('host_id', $userId)
            ->latest()
            ->get();

        $allVenues = Venue::where('status', 'active')->get();

        return Inertia::render('Messages/Index', [
            'contacts' => $contacts,
            'activeContact' => $activeContact,
            'messages' => $messages,
            'selectedVenue' => $selectedVenue,
            'appointments' => $appointments,
            'allVenues' => $allVenues
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'venue_id' => 'nullable|exists:venues,id',
            'content' => 'nullable|string|required_without:attachment',
            'attachment' => 'nullable|image|max:5120',
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('messages/attachments', 'public');
        }

        $message = Message::create([
            'sender_id' => Auth::id() ?? 1,
            'receiver_id' => $data['receiver_id'],
            'venue_id' => $data['venue_id'] ?? null,
            'content' => $data['content'] ?? '',
            'attachment' => $attachmentPath,
            'is_read' => false,
        ]);

        broadcast(new MessageSent($message))->toOthers();
        broadcast(new UnreadMessageNotification($message->sender_id, $message->receiver_id))->toOthers();

        return back();
    }

    public function fetch(Request $request, $contactId)
    {
        $userId = Auth::id() ?? 1;
        $lastMessageId = $request->get('last_id', 0);

        $messages = Message::with(['sender', 'venue'])
            ->where(function ($q) use ($userId, $contactId) {
                $q->where('sender_id', $userId)->where('receiver_id', $contactId);
            })
            ->orWhere(function ($q) use ($userId, $contactId) {
                $q->where('sender_id', $contactId)->where('receiver_id', $userId);
            })
            ->where('id', '>', $lastMessageId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['messages' => $messages]);
    }

    public function markAsRead(Request $request, $contactId)
    {
        $userId = Auth::id() ?? 1;

        Message::where('sender_id', $contactId)
            ->where('receiver_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }

    public function unreadCounts(Request $request)
    {
        $userId = Auth::id() ?? 1;

        $unreadMessages = Message::where('receiver_id', $userId)
            ->where('is_read', false)
            ->get();

        $totalUnread = $unreadMessages->count();

        $unreadPerContact = $unreadMessages->groupBy('sender_id')->map->count();

        return response()->json([
            'totalUnread' => $totalUnread,
            'unreadPerContact' => $unreadPerContact
        ]);
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
            'status' => 'pending',
            'notes' => $data['notes'] ?? null,
        ]);

        Message::create([
            'sender_id' => Auth::id() ?? 1,
            'receiver_id' => $venue->user_id,
            'venue_id' => $venue->id,
            'content' => 'Demande de rendez-vous (' . ($data['type'] === 'physical_visit' ? 'Visite physique' : 'Appel Video') . ') planifiee pour le ' . date('d/m/Y a H:i', strtotime($data['scheduled_at'])) . ' pour le lieu "' . $venue->title . '".',
            'is_read' => false,
        ]);

        broadcast(new UnreadMessageNotification(Auth::id() ?? 1, $venue->user_id))->toOthers();

        return back()->with('success', 'Rendez-vous planifie avec succes ! L\'hote en a ete notifie.');
    }
}