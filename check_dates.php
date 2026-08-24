<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$venues = \App\Models\Venue::all();
foreach ($venues as $v) {
    echo "ID: " . $v->id . " | created_at: " . $v->created_at . " | status: " . $v->status . "\n";
}
