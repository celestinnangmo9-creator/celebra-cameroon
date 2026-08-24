<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$venues = \App\Models\Venue::whereIn('id', [6, 7])->get();
foreach ($venues as $v) {
    echo "ID: " . $v->id . "\n";
    echo "Price: " . var_export($v->price_per_day, true) . "\n";
    echo "Rating: " . var_export($v->rating, true) . "\n";
    echo "Status: " . $v->status . "\n";
    echo "Main Image: " . var_export($v->main_image, true) . "\n";
    echo "--------------------------\n";
}
