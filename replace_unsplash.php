<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$venues = \App\Models\Venue::all();
$count = 0;
foreach ($venues as $venue) {
    $updated = false;
    if (str_contains($venue->main_image, 'unsplash')) {
        $venue->main_image = '/images/placeholder-venue.svg';
        $updated = true;
    }
    
    $gallery = is_string($venue->gallery_images) ? json_decode($venue->gallery_images, true) : $venue->gallery_images;
    if (is_array($gallery)) {
        $newGallery = [];
        $gUpdated = false;
        foreach ($gallery as $img) {
            if (str_contains($img, 'unsplash')) {
                $newGallery[] = '/images/placeholder-venue.svg';
                $gUpdated = true;
            } else {
                $newGallery[] = $img;
            }
        }
        if ($gUpdated) {
            $venue->gallery_images = $newGallery;
            $updated = true;
        }
    }
    
    if ($updated) {
        $venue->save();
        $count++;
    }
}
echo "Updated $count venues.\n";

$users = \App\Models\User::all();
$uCount = 0;
foreach ($users as $user) {
    if (str_contains($user->avatar, 'unsplash') || str_contains($user->avatar, 'ui-avatars')) {
        $user->avatar = '/images/placeholder-avatar.svg';
        $user->save();
        $uCount++;
    }
}
echo "Updated $uCount users.\n";
