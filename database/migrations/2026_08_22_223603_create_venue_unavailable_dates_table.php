<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('venue_unavailable_dates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venue_id')->constrained('venues')->cascadeOnDelete();
            // J'ai adapté à 'bookings' car c'est le nom de votre table réelle dans le projet
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->date('date');
            $table->timestamps();

            $table->unique(['venue_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venue_unavailable_dates');
    }
};
