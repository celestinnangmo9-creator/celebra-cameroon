<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Booking;

class BookingStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    public $booking;
    public $statusMessage;

    /**
     * Create a new notification instance.
     */
    public function __construct(Booking $booking, $statusMessage)
    {
        $this->booking = $booking;
        $this->statusMessage = $statusMessage;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'venue_title' => $this->booking->venue->title,
            'message' => $this->statusMessage,
        ];
    }
}
