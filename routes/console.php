<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

\Illuminate\Support\Facades\Schedule::command('app:backup-db')->dailyAt('02:00');

\Illuminate\Support\Facades\Schedule::call(function () {
    // 1. Process expirations
    $expiredUsers = \App\Models\User::whereIn('role', ['host'])
        ->where(function($query) {
            $query->where('subscription_status', 'trial')
                  ->where('trial_ends_at', '<', now());
        })
        ->orWhere(function($query) {
            $query->where('subscription_status', 'active')
                  ->where('subscription_ends_at', '<', now());
        })->get();

    foreach ($expiredUsers as $user) {
        $user->subscription_status = 'expired';
        $user->save();
        
        // Hide their venues
        \App\Models\Venue::where('user_id', $user->id)->update(['status' => 'hidden']);
    }

    // 2. Process Notifications (J-7 and J-1)
    $usersToNotify7 = \App\Models\User::whereIn('role', ['host'])
        ->whereIn('subscription_status', ['trial', 'active'])
        ->where(function($query) {
            $query->whereDate('trial_ends_at', now()->addDays(7)->toDateString())
                  ->orWhereDate('subscription_ends_at', now()->addDays(7)->toDateString());
        })->get();

    foreach ($usersToNotify7 as $user) {
        \App\Models\Notification::create([
            'user_id' => $user->id,
            'type' => 'subscription_reminder',
            'title' => 'Expiration dans 7 jours',
            'content' => 'Votre abonnement ou période d\'essai expire dans 7 jours. Pensez à le renouveler pour garder vos salles visibles.',
            'action_url' => '/dashboard/subscription',
        ]);
    }

    $usersToNotify1 = \App\Models\User::whereIn('role', ['host'])
        ->whereIn('subscription_status', ['trial', 'active'])
        ->where(function($query) {
            $query->whereDate('trial_ends_at', now()->addDays(1)->toDateString())
                  ->orWhereDate('subscription_ends_at', now()->addDays(1)->toDateString());
        })->get();

    foreach ($usersToNotify1 as $user) {
        \App\Models\Notification::create([
            'user_id' => $user->id,
            'type' => 'subscription_reminder_urgent',
            'title' => 'Expiration demain',
            'content' => 'Urgent : Votre abonnement expire demain. Renouvelez-le dès maintenant pour éviter la désactivation de vos salles.',
            'action_url' => '/dashboard/subscription',
        ]);
    }
})->dailyAt('00:01');
