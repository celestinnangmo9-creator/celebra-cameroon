<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class VenueController extends Controller
{
    public function home()
    {
        $featuredVenues = Venue::with(['user', 'reviews'])->where('is_featured', true)->where('status', 'active')->take(6)->get();
        $latestVenues = Venue::with(['user', 'reviews'])->where('status', 'active')->latest()->take(6)->get();
        
        $regionsAndCities = [
            'Adamaoua' => ['Ngaoundéré', 'Banyo', 'Meiganga', 'Tignère', 'Tibati'],
            'Centre' => ['Yaoundé', 'Bafia', 'Mbalmayo', 'Obala', 'Monatélé', 'Eseka', 'Akonolinga'],
            'Est' => ['Bertoua', 'Batouri', 'Abong-Mbang', 'Yokadouma', 'Lomié'],
            'Extrême-Nord' => ['Maroua', 'Yagoua', 'Kousséri', 'Mokolo', 'Kaélé', 'Mora'],
            'Littoral' => ['Douala', 'Edéa', 'Nkongsamba', 'Yabassi', 'Melong', 'Loum'],
            'Nord' => ['Garoua', 'Guider', 'Figuil', 'Pitoa', 'Tcholliré'],
            'Nord-Ouest' => ['Bamenda', 'Kumbo', 'Wum', 'Ndop', 'Mbengwi'],
            'Ouest' => ['Bafoussam', 'Dschang', 'Foumban', 'Mbouda', 'Bangangté', 'Bandjoun'],
            'Sud' => ['Ebolowa', 'Kribi', 'Sangmélima', 'Ambam', 'Campo'],
            'Sud-Ouest' => ['Buea', 'Limbe', 'Kumba', 'Tiko', 'Mamfe']
        ];
        $categories = ['Salle de fête', 'Salle de Conférence', 'Espace vert', 'Bureau & Coworking', 'Terrasse VIP', 'Pavillon / Villa'];

        return Inertia::render('Home', [
            'featuredVenues' => $featuredVenues,
            'latestVenues' => $latestVenues,
            'regionsAndCities' => $regionsAndCities,
            'categories' => $categories
        ]);
    }

    public function index(Request $request)
    {
        $query = Venue::where('status', 'active');

        if ($request->filled('region')) {
            $query->where('region', $request->region);
        }

        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('min_price')) {
            $query->where('price_per_day', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price_per_day', '<=', $request->max_price);
        }

        if ($request->filled('capacity')) {
            $query->where('capacity', '>=', $request->capacity);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('district', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        $venues = $query->with(['user', 'reviews'])->latest()->paginate(9)->withQueryString();

        $regionsAndCities = [
            'Adamaoua' => ['Ngaoundéré', 'Banyo', 'Meiganga', 'Tignère', 'Tibati'],
            'Centre' => ['Yaoundé', 'Bafia', 'Mbalmayo', 'Obala', 'Monatélé', 'Eseka', 'Akonolinga'],
            'Est' => ['Bertoua', 'Batouri', 'Abong-Mbang', 'Yokadouma', 'Lomié'],
            'Extrême-Nord' => ['Maroua', 'Yagoua', 'Kousséri', 'Mokolo', 'Kaélé', 'Mora'],
            'Littoral' => ['Douala', 'Edéa', 'Nkongsamba', 'Yabassi', 'Melong', 'Loum'],
            'Nord' => ['Garoua', 'Guider', 'Figuil', 'Pitoa', 'Tcholliré'],
            'Nord-Ouest' => ['Bamenda', 'Kumbo', 'Wum', 'Ndop', 'Mbengwi'],
            'Ouest' => ['Bafoussam', 'Dschang', 'Foumban', 'Mbouda', 'Bangangté', 'Bandjoun'],
            'Sud' => ['Ebolowa', 'Kribi', 'Sangmélima', 'Ambam', 'Campo'],
            'Sud-Ouest' => ['Buea', 'Limbe', 'Kumba', 'Tiko', 'Mamfe']
        ];
        $categories = ['Salle de fête', 'Salle de Conférence', 'Espace vert', 'Bureau & Coworking', 'Terrasse VIP', 'Pavillon / Villa'];

        return Inertia::render('Venues/Index', [
            'venues' => $venues,
            'regionsAndCities' => $regionsAndCities,
            'categories' => $categories
        ]);
    }

    public function show($id)
    {
        $venue = Venue::with(['user', 'reviews.user'])->findOrFail($id);
        $similarVenues = Venue::where('category', $venue->category)
            ->where('id', '!=', $venue->id)
            ->take(3)
            ->get();

        // Fetch bookings to disable dates in calendar
        $bookings = \App\Models\Booking::where('venue_id', $venue->id)
            ->whereIn('status', ['confirmed', 'pending'])
            ->get();

        $bookedDates = [];
        foreach ($bookings as $booking) {
            $period = \Carbon\CarbonPeriod::create($booking->start_date, $booking->end_date);
            foreach ($period as $date) {
                $bookedDates[] = $date->format('Y-m-d');
            }
        }
        $bookedDates = array_unique($bookedDates);

        return Inertia::render('Venues/Show', [
            'venue' => $venue,
            'similarVenues' => $similarVenues,
            'bookedDates' => $bookedDates
        ]);
    }

    public function create()
    {
        if (!Auth::user()->isHost()) {
            return redirect()->route('home')->with('error', 'Seuls les hôtes ou propriétaires peuvent publier un espace.');
        }

        $regionsAndCities = [
            'Adamaoua' => ['Ngaoundéré', 'Banyo', 'Meiganga', 'Tignère', 'Tibati'],
            'Centre' => ['Yaoundé', 'Bafia', 'Mbalmayo', 'Obala', 'Monatélé', 'Eseka', 'Akonolinga'],
            'Est' => ['Bertoua', 'Batouri', 'Abong-Mbang', 'Yokadouma', 'Lomié'],
            'Extrême-Nord' => ['Maroua', 'Yagoua', 'Kousséri', 'Mokolo', 'Kaélé', 'Mora'],
            'Littoral' => ['Douala', 'Edéa', 'Nkongsamba', 'Yabassi', 'Melong', 'Loum'],
            'Nord' => ['Garoua', 'Guider', 'Figuil', 'Pitoa', 'Tcholliré'],
            'Nord-Ouest' => ['Bamenda', 'Kumbo', 'Wum', 'Ndop', 'Mbengwi'],
            'Ouest' => ['Bafoussam', 'Dschang', 'Foumban', 'Mbouda', 'Bangangté', 'Bandjoun'],
            'Sud' => ['Ebolowa', 'Kribi', 'Sangmélima', 'Ambam', 'Campo'],
            'Sud-Ouest' => ['Buea', 'Limbe', 'Kumba', 'Tiko', 'Mamfe']
        ];
        $categories = ['Salle de fête', 'Salle de Conférence', 'Espace vert', 'Bureau & Coworking', 'Terrasse VIP', 'Pavillon / Villa'];
        $availableAmenities = ['Climatisation', 'Groupe Électrogène', 'Sonorisation Haute Fidélité', 'Service Traiteur', 'Parking Sécurisé', 'Fibre Optique / Wifi', 'Écran LED Géant', 'Piscine Privée', 'Régie Lumières DJ'];

        return Inertia::render('Venues/Create', [
            'regionsAndCities' => $regionsAndCities,
            'categories' => $categories,
            'availableAmenities' => $availableAmenities
        ]);
    }

    public function store(\App\Http\Requests\StoreVenueRequest $request)
    {
        if (!Auth::user()->isHost()) {
            return redirect()->route('home')->with('error', 'Action non autorisée. Devenez hôte pour publier un espace.');
        }

        $data = $request->validated();

        $mainImagePath = '';
        if ($request->hasFile('main_image')) {
            $path = $request->file('main_image')->store('venues', 'public');
            $mainImagePath = '/storage/' . $path;
        }

        $galleryPaths = [];
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $path = $file->store('venues', 'public');
                $galleryPaths[] = '/storage/' . $path;
            }
        }

        $venue = Venue::create([
            'user_id' => Auth::id() ?? 1,
            'title' => $data['title'],
            'slug' => Str::slug($data['title']) . '-' . rand(100, 999),
            'category' => $data['category'],
            'region' => $data['region'],
            'city' => $data['city'],
            'district' => $data['district'],
            'address' => $data['address'],
            'capacity' => $data['capacity'],
            'price_per_day' => $data['price_per_day'],
            'price_per_hour' => $data['price_per_hour'] ?? null,
            'description' => $data['description'],
            'amenities' => $data['amenities'] ?? [],
            'main_image' => $mainImagePath,
            'gallery_images' => $galleryPaths,
            'status' => 'active',
            'is_featured' => false,
            'rating' => 5.0,
            'reviews_count' => 0,
        ]);

        return redirect()->route('venues.show', $venue->id)->with('success', 'Votre espace a été publié avec succès sur Celebra Cameroon !');
    }

    public function edit($id)
    {
        $venue = Venue::findOrFail($id);
        
        // Ensure only owner can edit
        if (Auth::check() && Auth::id() !== $venue->user_id && !Auth::user()->isAdmin()) {
            return redirect()->route('venues.index')->with('error', 'Vous n\'êtes pas autorisé à modifier cette annonce.');
        }

        $regionsAndCities = [
            'Adamaoua' => ['Ngaoundéré', 'Banyo', 'Meiganga', 'Tignère', 'Tibati'],
            'Centre' => ['Yaoundé', 'Bafia', 'Mbalmayo', 'Obala', 'Monatélé', 'Eseka', 'Akonolinga'],
            'Est' => ['Bertoua', 'Batouri', 'Abong-Mbang', 'Yokadouma', 'Lomié'],
            'Extrême-Nord' => ['Maroua', 'Yagoua', 'Kousséri', 'Mokolo', 'Kaélé', 'Mora'],
            'Littoral' => ['Douala', 'Edéa', 'Nkongsamba', 'Yabassi', 'Melong', 'Loum'],
            'Nord' => ['Garoua', 'Guider', 'Figuil', 'Pitoa', 'Tcholliré'],
            'Nord-Ouest' => ['Bamenda', 'Kumbo', 'Wum', 'Ndop', 'Mbengwi'],
            'Ouest' => ['Bafoussam', 'Dschang', 'Foumban', 'Mbouda', 'Bangangté', 'Bandjoun'],
            'Sud' => ['Ebolowa', 'Kribi', 'Sangmélima', 'Ambam', 'Campo'],
            'Sud-Ouest' => ['Buea', 'Limbe', 'Kumba', 'Tiko', 'Mamfe']
        ];
        $categories = ['Salle de fête', 'Salle de Conférence', 'Espace vert', 'Bureau & Coworking', 'Terrasse VIP', 'Pavillon / Villa'];
        $availableAmenities = ['Climatisation', 'Groupe Électrogène', 'Sonorisation Haute Fidélité', 'Service Traiteur', 'Parking Sécurisé', 'Fibre Optique / Wifi', 'Écran LED Géant', 'Piscine Privée', 'Régie Lumières DJ'];

        return Inertia::render('Venues/Edit', [
            'venue' => $venue,
            'regionsAndCities' => $regionsAndCities,
            'categories' => $categories,
            'availableAmenities' => $availableAmenities
        ]);
    }

    public function update(\App\Http\Requests\UpdateVenueRequest $request, $id)
    {
        $venue = Venue::findOrFail($id);

        $data = $request->validated();

        $mainImagePath = $venue->main_image;
        if ($request->hasFile('main_image')) {
            $path = $request->file('main_image')->store('venues', 'public');
            $mainImagePath = '/storage/' . $path;
        }

        $galleryPaths = $venue->gallery_images ?? [];
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $path = $file->store('venues', 'public');
                $galleryPaths[] = '/storage/' . $path;
            }
        }

        $venue->update([
            'title' => $data['title'],
            'category' => $data['category'],
            'region' => $data['region'],
            'city' => $data['city'],
            'district' => $data['district'],
            'address' => $data['address'],
            'capacity' => $data['capacity'],
            'price_per_day' => $data['price_per_day'],
            'price_per_hour' => $data['price_per_hour'] ?? null,
            'description' => $data['description'],
            'amenities' => $data['amenities'] ?? [],
            'main_image' => $mainImagePath,
            'gallery_images' => $galleryPaths,
            'status' => $data['status'],
        ]);

        return redirect()->route('venues.show', $venue->id)->with('success', 'L\'annonce a été mise à jour avec succès.');
    }

    public function destroy($id)
    {
        $venue = Venue::findOrFail($id);

        if (Auth::check() && Auth::id() !== $venue->user_id && !Auth::user()->isAdmin()) {
            return redirect()->route('venues.index')->with('error', 'Action non autorisée.');
        }

        $venue->delete();

        return redirect()->route('venues.index')->with('success', 'L\'espace a été supprimé.');
    }
}
