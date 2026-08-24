<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\SubscriptionPlan;
use Carbon\Carbon;

// Create Subscription Plans
if (SubscriptionPlan::count() === 0) {
    SubscriptionPlan::create([
        'slug' => 'basique',
        'name' => 'Basique',
        'price' => 5000.00,
        'max_venues' => 3,
        'is_featured' => false,
    ]);

    SubscriptionPlan::create([
        'slug' => 'premium',
        'name' => 'Premium',
        'price' => 15000.00,
        'max_venues' => null, // unlimited
        'is_featured' => true,
    ]);
    echo "Plans created.\n";
} else {
    echo "Plans already exist.\n";
}

// Update existing Hosts and Admins
$hosts = User::whereIn('role', ['host', 'admin'])->get();
foreach ($hosts as $host) {
    $host->trial_ends_at = Carbon::now()->addDays(30);
    $host->subscription_status = 'trial';
    $host->save();
}

echo "Updated " . $hosts->count() . " hosts with 30 days trial.\n";
