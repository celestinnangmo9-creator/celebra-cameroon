<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = \App\Models\User::all();
foreach ($users as $user) {
    echo "User ID: {$user->id}, Email: {$user->email}, Venues: {$user->venues()->count()}\n";
}

$allVenues = \App\Models\Venue::count();
echo "Total venues in DB: {$allVenues}\n";
