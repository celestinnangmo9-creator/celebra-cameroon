<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('venues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category'); // Salle de fête, Espace vert, Bureau & Coworking, Terrasse VIP, Pavillon / Villa
            $table->string('city'); // Douala, Yaoundé, Kribi, Limbe, Bafoussam
            $table->string('district'); // Bastos, Bonapriso, Akwa, Golf, Makepe, etc.
            $table->string('address');
            $table->integer('capacity');
            $table->decimal('price_per_day', 10, 2);
            $table->decimal('price_per_hour', 10, 2)->nullable();
            $table->text('description');
            $table->json('amenities')->nullable(); // Climatisation, Groupe Électrogène, Sonorisation, Traiteur, Parking, Wifi, Ecran Géant, Piscine
            $table->string('main_image');
            $table->json('gallery_images')->nullable();
            $table->string('status')->default('active'); // active, maintenance, booked
            $table->boolean('is_featured')->default(false);
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->integer('reviews_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('venues');
    }
};
