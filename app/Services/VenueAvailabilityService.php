<?php

namespace App\Services;

use App\Models\Venue;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class VenueAvailabilityService
{
    /**
     * Retourne toutes les dates réservées pour une salle, formatées pour le frontend (ISO).
     *
     * @param  \App\Models\Venue  $venue
     * @return array
     */
    public function getUnavailableDates(Venue $venue): array
    {
        return DB::table('venue_unavailable_dates')
            ->where('venue_id', $venue->id)
            ->where('date', '>=', Carbon::today()->toDateString())
            ->pluck('date')
            ->toArray();
    }

    /**
     * Vérifie côté serveur si une date précise est libre.
     *
     * @param  \App\Models\Venue  $venue
     * @param  string  $date (Format Y-m-d)
     * @return bool
     */
    public function isDateAvailable(Venue $venue, string $date): bool
    {
        $exists = DB::table('venue_unavailable_dates')
            ->where('venue_id', $venue->id)
            ->where('date', $date)
            ->exists();

        return !$exists;
    }

    /**
     * Crée automatiquement les entrées pour bloquer une plage de dates.
     *
     * @param  \App\Models\Venue  $venue
     * @param  int  $bookingId
     * @param  string  $startDate
     * @param  string  $endDate
     * @return void
     */
    public function markDatesAsUnavailable(Venue $venue, int $bookingId, string $startDate, string $endDate): void
    {
        $period = CarbonPeriod::create($startDate, $endDate);
        $insertData = [];

        foreach ($period as $date) {
            $insertData[] = [
                'venue_id' => $venue->id,
                'booking_id' => $bookingId,
                'date' => $date->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('venue_unavailable_dates')->insertOrIgnore($insertData);
    }
}
