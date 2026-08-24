<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Venue;
use Illuminate\Support\Facades\Hash;

$email = 'celestinnangmo9@gmail.com';
$user = User::where('email', $email)->first();

if (!$user) {
    $user = User::create([
        'name' => 'Célestin Admin',
        'email' => $email,
        'password' => Hash::make('password'),
        'role' => 'admin',
        'phone' => '+237 600000000',
    ]);
    echo "User created with ID: " . $user->id . "\n";
} else {
    echo "User already exists with ID: " . $user->id . "\n";
    // Ensure the user is admin
    if ($user->role !== 'admin') {
        $user->role = 'admin';
        $user->save();
        echo "Updated user role to admin.\n";
    }
}

// Update the 3 fictional venues
$slugs = [
    'le-grand-palais-royal-yaounde',
    'domaine-de-la-brise-marine-douala',
    'centre-de-conference-des-hauts-plateaux-bafoussam'
];

$updatedCount = 0;
foreach ($slugs as $slug) {
    $venue = Venue::where('slug', $slug)->first();
    if ($venue) {
        $venue->user_id = $user->id;
        $venue->save();
        $updatedCount++;
    }
}

echo "Updated $updatedCount venues to be owned by $email.\n";
