<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Venue;
use App\Models\Booking;
use App\Models\Message;
use App\Models\Appointment;
use App\Models\Review;
use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Host User
        $host = User::create([
            'name' => 'Jean-Paul Mbida',
            'email' => 'host@celebra.cm',
            'password' => Hash::make('password'),
            'role' => 'host',
            'phone' => '+237 696675924',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            'bio' => 'Gestionnaire de lieux d\'exception au Cameroun depuis 8 ans. Passionné par l\'organisation d\'événements inoubliables.',
            'trial_ends_at' => Carbon::now()->addDays(30),
            'subscription_status' => 'trial',
        ]);

        $host2 = User::create([
            'name' => 'Chantal Eboa',
            'email' => 'chantal@celebra.cm',
            'password' => Hash::make('password'),
            'role' => 'host',
            'phone' => '+237 6 77 11 22 33',
            'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
            'bio' => 'Propriétaire de domaines événementiels balnéaires à Kribi et espaces VIP à Douala.',
            'trial_ends_at' => Carbon::now()->addDays(30),
            'subscription_status' => 'trial',
        ]);

        // 2. Create Client User
        $client = User::create([
            'name' => 'Marcelle Nsangou',
            'email' => 'client@celebra.cm',
            'password' => Hash::make('password'),
            'role' => 'client',
            'phone' => '+237 6 55 44 33 22',
            'avatar' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
            'bio' => 'Planificatrice d\'événements d\'entreprises et célébrations familiales.',
        ]);

        // 3. Create Admin User
        User::create([
            'name' => 'Administrateur Celebra',
            'email' => 'admin@celebra.cm',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+237 6 90 00 11 22',
        ]);

        // 4. Create Subscription Plans
        SubscriptionPlan::create([
            'slug' => 'basique',
            'name' => 'Basique',
            'price' => 5000.00,
            'max_venues' => 3,
            'is_featured' => false,
        ]);

        SubscriptionPlan::create([
            'slug' => 'premium',
            'name' => 'Premium',
            'price' => 15000.00,
            'max_venues' => null, // unlimited
            'is_featured' => true,
        ]);

        // 5. Create Venues
        $v1 = Venue::create([
            'user_id' => $host->id,
            'title' => 'Palais des Lumières & Espace Banquet',
            'slug' => Str::slug('Palais des Lumieres Espace Banquet'),
            'category' => 'Salle de fête',
            'city' => 'Douala',
            'district' => 'Bonapriso',
            'address' => 'Avenue des Palmiers, Bonapriso, Douala',
            'capacity' => 450,
            'price_per_day' => 350000.00,
            'price_per_hour' => 45000.00,
            'description' => 'Le Palais des Lumières est une salle de fête luxueuse modulable pour vos mariages, galas d\'entreprises, soirées de prestige et anniversaires. Entièrement insonorisée et équipée d\'un groupe électrogène de secours de 150 kVA.',
            'amenities' => ['Climatisation', 'Groupe Électrogène', 'Sonorisation Haute Fidélité', 'Service Traiteur', 'Parking Sécurisé 60 Places', 'Écran LED Géant', 'Espace Loge VIP'],
            'main_image' => 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
            'gallery_images' => [
                'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'
            ],
            'status' => 'active',
            'is_featured' => true,
            'rating' => 4.95,
            'reviews_count' => 18,
        ]);

        $v2 = Venue::create([
            'user_id' => $host2::class ? $host2->id : $host->id,
            'title' => 'Domaine Océanique & Jardin des Cocotiers',
            'slug' => Str::slug('Domaine Oceanique Jardin des Cocotiers'),
            'category' => 'Espace vert',
            'city' => 'Kribi',
            'district' => 'Grand Batanga',
            'address' => 'Route de la Plage, Grand Batanga, Kribi',
            'capacity' => 600,
            'price_per_day' => 280000.00,
            'price_per_hour' => 35000.00,
            'description' => 'Un espace vert d\'exception au bord de l\'océan Atlantique à Kribi. Idéal pour les mariages champêtres, mariages coutumiers, garden parties et concerts privés les pieds dans le sable.',
            'amenities' => ['Espace Vert Gazonné', 'Vue Panoramique Mer', 'Groupe Électrogène', 'Éclairage Festif Nuit', 'Bar de Plage VIP', 'Parking Gardé'],
            'main_image' => 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
            'gallery_images' => [
                'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
            ],
            'status' => 'active',
            'is_featured' => true,
            'rating' => 4.88,
            'reviews_count' => 12,
        ]);

        $v3 = Venue::create([
            'user_id' => $host->id,
            'title' => 'Bastos Executive Hub & Salle de Conférence',
            'slug' => Str::slug('Bastos Executive Hub Salle de Conference'),
            'category' => 'Bureau & Coworking',
            'city' => 'Yaoundé',
            'district' => 'Bastos',
            'address' => 'Rue des Ambassades, Bastos, Yaoundé',
            'capacity' => 80,
            'price_per_day' => 180000.00,
            'price_per_hour' => 25000.00,
            'description' => 'Salle de conférence ultra-moderne au cœur du quartier résidentiel de Bastos à Yaoundé. Équipée de vidéoprojecteur 4K, microphones sans fil, fibre optique très haut débit et service pause-café.',
            'amenities' => ['Visioconférence 4K', 'Fibre Optique 100Mbps', 'Climatisation Centrale', 'Service Pause Cafétéria', 'Insonorisation', 'Parking VIP'],
            'main_image' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
            'gallery_images' => [
                'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80'
            ],
            'status' => 'active',
            'is_featured' => true,
            'rating' => 4.90,
            'reviews_count' => 9,
        ]);

        $v4 = Venue::create([
            'user_id' => $host2->id,
            'title' => 'Villa Royale avec Piscine & Terrasse VIP',
            'slug' => Str::slug('Villa Royale avec Piscine Terrasse VIP'),
            'category' => 'Pavillon / Villa',
            'city' => 'Yaoundé',
            'district' => 'Golf',
            'address' => 'Quartier du Golf, Yaoundé',
            'capacity' => 150,
            'price_per_day' => 400000.00,
            'price_per_hour' => 50000.00,
            'description' => 'Villa somptueuse avec piscine olympique, terrasse VIP et vue imprenable sur les collines du Golf de Yaoundé. Parfaite pour cocktails privatifs, lancements de marques et cérémonies intimistes.',
            'amenities' => ['Piscine Privée', 'Terrasse Panoramique', 'Mobilier Lounge Luxe', 'Groupe Électrogène', 'Sécurité H24', 'Suite Nuptiale'],
            'main_image' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
            'gallery_images' => [
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'
            ],
            'status' => 'active',
            'is_featured' => true,
            'rating' => 5.00,
            'reviews_count' => 15,
        ]);

        $v5 = Venue::create([
            'user_id' => $host->id,
            'title' => 'Lounge RoofTop 360 Akwa',
            'slug' => Str::slug('Lounge RoofTop 360 Akwa'),
            'category' => 'Terrasse VIP',
            'city' => 'Douala',
            'district' => 'Akwa',
            'address' => 'Boulevard de la Liberté, Akwa, Douala',
            'capacity' => 200,
            'price_per_day' => 250000.00,
            'price_per_hour' => 30000.00,
            'description' => 'Un rooftop spectaculaire offrant une vue panoramique sur le fleuve Wouri et le port de Douala. Ambiance chic, régie DJ professionnelle et bar central rétroéclairé.',
            'amenities' => ['Vue Panoramique 360°', 'Régie DJ & Lumières', 'Bar Central VIP', 'Service Traiteur', 'Ascenseur Privatif'],
            'main_image' => 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?auto=format&fit=crop&w=1200&q=80',
            'gallery_images' => [
                'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?auto=format&fit=crop&w=800&q=80'
            ],
            'status' => 'active',
            'is_featured' => false,
            'rating' => 4.82,
            'reviews_count' => 7,
        ]);

        // 5. Create Sample Bookings
        Booking::create([
            'user_id' => $client->id,
            'venue_id' => $v1->id,
            'start_date' => '2026-08-15',
            'end_date' => '2026-08-16',
            'guest_count' => 300,
            'event_type' => 'Mariage',
            'total_price' => 700000.00,
            'status' => 'confirmed',
            'special_requests' => 'Installation des tables rondes et accès au groupe électrogène dès 8h du matin.',
        ]);

        Booking::create([
            'user_id' => $client->id,
            'venue_id' => $v3->id,
            'start_date' => '2026-09-02',
            'end_date' => '2026-09-02',
            'guest_count' => 50,
            'event_type' => 'Séminaire',
            'total_price' => 180000.00,
            'status' => 'pending',
            'special_requests' => 'Pause café prévue à 10h30 et matériel de visioconférence.',
        ]);

        // 6. Create Messages
        Message::create([
            'sender_id' => $client->id,
            'receiver_id' => $host->id,
            'venue_id' => $v1->id,
            'content' => 'Bonjour M. Jean-Paul, je souhaite savoir si la salle Palais des Lumières est libre pour le weekend du 15 août.',
            'is_read' => true,
        ]);

        Message::create([
            'sender_id' => $host->id,
            'receiver_id' => $client->id,
            'venue_id' => $v1->id,
            'content' => 'Bonjour Mme Marcelle ! Oui, la salle est disponible. Vous pouvez effectuer la réservation directement sur la plateforme ou planifier une visite.',
            'is_read' => true,
        ]);

        // 7. Create Appointment
        Appointment::create([
            'user_id' => $client->id,
            'host_id' => $host->id,
            'venue_id' => $v1->id,
            'scheduled_at' => '2026-08-01 14:00:00',
            'type' => 'physical_visit',
            'status' => 'scheduled',
            'notes' => 'Visite des installations et test de l\'acoustique.',
        ]);

        // 8. Create Reviews
        Review::create([
            'user_id' => $client->id,
            'venue_id' => $v1->id,
            'rating' => 5,
            'comment' => 'Salle exceptionnelle à Bonapriso ! Le groupe électrogène a fonctionné sans interruption pendant toute notre soirée.',
        ]);
    }
}
