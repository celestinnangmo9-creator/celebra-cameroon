<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Venue;
use App\Models\User;
use Illuminate\Support\Str;

// Destination directory
$destDir = public_path('images/venues');
if (!file_exists($destDir)) {
    mkdir($destDir, 0777, true);
}

// Source images
$srcDir = 'C:\Users\celestin\.gemini\antigravity-ide\brain\ffbc1589-3513-44ef-90f8-6cac7d725f91\.user_uploaded';

// The images uploaded by the user
$image1 = $srcDir . DIRECTORY_SEPARATOR . 'media_1787236930155.jpg'; // Wedding hall
$image2 = $srcDir . DIRECTORY_SEPARATOR . 'media_1787236947488.jpg'; // Outdoor tent
$image3 = $srcDir . DIRECTORY_SEPARATOR . 'media_1787236979282.jpg'; // Classroom

// Rename and copy
$destImage1 = 'images/venues/fictional_wedding_yaounde.jpg';
$destImage2 = 'images/venues/fictional_outdoor_douala.jpg';
$destImage3 = 'images/venues/fictional_class_bafoussam.jpg';

copy($image1, public_path($destImage1));
copy($image2, public_path($destImage2));
copy($image3, public_path($destImage3));

echo "Images copied.\n";

$host = User::where('role', 'host')->first();
if (!$host) {
    die("No host found.");
}

// Create Yaounde Venue
Venue::create([
    'user_id' => $host->id,
    'title' => 'Le Grand Palais Royal',
    'slug' => Str::slug('Le Grand Palais Royal Yaounde'),
    'category' => 'Salle de fête',
    'city' => 'Yaoundé',
    'district' => 'Bastos',
    'address' => 'Avenue des Ambassades, Bastos',
    'capacity' => 800,
    'price_per_day' => 500000.00,
    'price_per_hour' => 50000.00,
    'description' => 'Une salle majestueuse pour les événements les plus prestigieux de la capitale. Décoration somptueuse avec lustres en cristal, parfaite pour les mariages de luxe et les galas.',
    'amenities' => ['Climatisation', 'Lustres en cristal', 'Service Traiteur', 'Parking Sécurisé 100 Places', 'Espace Loge VIP'],
    'main_image' => '/' . $destImage1,
    'gallery_images' => ['/' . $destImage1],
    'status' => 'active',
    'is_featured' => true,
    'rating' => 5.0,
    'reviews_count' => 42,
]);
echo "Yaoundé venue created.\n";

// Create Douala Venue
Venue::create([
    'user_id' => $host->id,
    'title' => 'Domaine de la Brise Marine',
    'slug' => Str::slug('Domaine de la Brise Marine Douala'),
    'category' => 'Espace vert',
    'city' => 'Douala',
    'district' => 'Bonanjo',
    'address' => 'Rue de la Marine, Bonanjo',
    'capacity' => 1000,
    'price_per_day' => 400000.00,
    'price_per_hour' => 40000.00,
    'description' => 'Magnifique espace vert avec chapiteau blanc, offrant une vue imprenable pour des réceptions en plein air inoubliables sous les tentes luxueuses.',
    'amenities' => ['Chapiteau', 'Espace Vert', 'Vue Mer', 'Éclairage Festif Nuit', 'Parking Gardé'],
    'main_image' => '/' . $destImage2,
    'gallery_images' => ['/' . $destImage2],
    'status' => 'active',
    'is_featured' => true,
    'rating' => 4.8,
    'reviews_count' => 25,
]);
echo "Douala venue created.\n";

// Create Bafoussam Venue
Venue::create([
    'user_id' => $host->id,
    'title' => 'Centre de Conférence des Hauts Plateaux',
    'slug' => Str::slug('Centre de Conference des Hauts Plateaux Bafoussam'),
    'category' => 'Salle de Conférence',
    'city' => 'Bafoussam',
    'district' => 'Djeleng',
    'address' => 'Carrefour Djeleng, Bafoussam',
    'capacity' => 150,
    'price_per_day' => 100000.00,
    'price_per_hour' => 15000.00,
    'description' => 'Idéal pour vos séminaires, formations et réunions. Salle lumineuse, climatisée et équipée de tables et chaises confortables pour l\'apprentissage.',
    'amenities' => ['Climatisation', 'Vidéoprojecteur', 'Wifi Haut Débit', 'Tableaux Blancs', 'Chaises confortables'],
    'main_image' => '/' . $destImage3,
    'gallery_images' => ['/' . $destImage3],
    'status' => 'active',
    'is_featured' => true,
    'rating' => 4.5,
    'reviews_count' => 12,
]);
echo "Bafoussam venue created.\n";

echo "All fictional venues inserted successfully!\n";
