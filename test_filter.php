<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$venues = App\Models\Venue::groupBy('category')->selectRaw('category, count(*) as total')->get();
echo json_encode($venues);
