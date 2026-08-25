<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $appointments = Appointment::with(['user', 'venue'])
            ->where('host_id', Auth::id())
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when($request->date_range, function ($query, $date_range) {
                if ($date_range === 'upcoming') {
                    return $query->where('scheduled_at', '>=', now());
                } elseif ($date_range === 'past') {
                    return $query->where('scheduled_at', '<', now());
                }
            })
            ->orderBy('scheduled_at', 'asc')
            ->get();

        return Inertia::render('Host/Appointments/Index', [
            'appointments' => $appointments,
            'filters' => $request->only(['status', 'date_range'])
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);
        
        \Illuminate\Support\Facades\Gate::authorize('update', $appointment);

        $request->validate([
            'status' => 'required|in:confirmed,refused,cancelled,completed'
        ]);

        $appointment->update([
            'status' => $request->status
        ]);

        // Envoyer un message automatique au client pour le notifier du changement de statut
        $statusText = '';
        if ($request->status === 'confirmed') {
            $statusText = '✅ confirmée';
        } elseif ($request->status === 'refused') {
            $statusText = '❌ refusée';
        } elseif ($request->status === 'cancelled') {
            $statusText = '⚠️ annulée';
        } elseif ($request->status === 'completed') {
            $statusText = 'terminée';
        }

        $visitType = $appointment->type === 'physical_visit' ? 'Visite physique' : 'Appel Vidéo';
        $formattedDate = date('d/m/Y à H:i', strtotime($appointment->scheduled_at));

        if (in_array($request->status, ['confirmed', 'refused', 'cancelled'])) {
            Message::create([
                'sender_id' => Auth::id(),
                'receiver_id' => $appointment->user_id,
                'venue_id' => $appointment->venue_id,
                'content' => "Votre demande de rendez-vous ($visitType) planifiée pour le $formattedDate pour le lieu \"{$appointment->venue->title}\" a été $statusText.",
                'is_read' => false,
            ]);
        }

        return back()->with('success', __('Statut du rendez-vous mis à jour avec succès.'));
    }
}
