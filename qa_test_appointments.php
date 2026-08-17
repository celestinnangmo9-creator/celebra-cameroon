<?php

use App\Models\User;
use App\Models\Venue;
use App\Models\Appointment;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// 1. Get a client and a host
$client = User::where('role', 'client')->first();
$host = User::where('role', 'host')->first();
$venue = Venue::where('user_id', $host->id)->first();

echo "Host ID: {$host->id}, Client ID: {$client->id}, Venue ID: {$venue->id}\n";

// 2. Create Appointment via Controller logic Simulation or direct DB
$appointment = Appointment::create([
    'user_id' => $client->id,
    'host_id' => $host->id,
    'venue_id' => $venue->id,
    'scheduled_at' => now()->addDays(2),
    'type' => 'physical_visit',
    'status' => 'pending',
    'notes' => 'Test visit via QA script',
]);

echo "Created Appointment ID: {$appointment->id} with status {$appointment->status}\n";

// 3. Update Status as Host
$request = Illuminate\Http\Request::create("/appointments/{$appointment->id}/status", 'PATCH', ['status' => 'confirmed']);
Auth::login($host);

// Bypass CSRF by directly calling Controller
$controller = new \App\Http\Controllers\AppointmentController();
try {
    $response = $controller->updateStatus($request, $appointment->id);
    echo "Controller returned response.\n";
} catch (\Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
}

$appointment->refresh();
echo "Appointment Status after update: {$appointment->status}\n";

// 4. Verify Message was created
$message = \App\Models\Message::where('venue_id', $venue->id)->where('sender_id', $host->id)->latest()->first();
if ($message && strpos($message->content, 'confirmée') !== false) {
    echo "Message generated: {$message->content}\n";
} else {
    echo "Message NOT generated properly!\n";
}

// 5. Check if another host can access this appointment
$anotherHost = User::where('role', 'host')->where('id', '!=', $host->id)->first();
if ($anotherHost) {
    $request2 = Illuminate\Http\Request::create("/appointments/{$appointment->id}/status", 'PATCH', ['status' => 'refused']);
    Auth::login($anotherHost);
    try {
        $controller->updateStatus($request2, $appointment->id);
    } catch (\Exception $e) {
        echo "Exception for unauthorized update: " . $e->getMessage() . "\n";
    }
}

echo "QA Test Completed.\n";
