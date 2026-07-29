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
        $featuredVenues = Venue::where('is_featured', true)->where('status', 'active')->take(6)->get();
        $latestVenues = Venue::where('status', 'active')->latest()->take(6)->get();
        
        $cities = ['Douala', 'Yaoundé', 'Kribi', 'Limbe', 'Bafoussam'];
        $categories = ['Salle de fête', 'Espace vert', 'Bureau & Coworking', 'Terrasse VIP', 'Pavillon / Villa'];

        return view('home', compact('featuredVenues', 'latestVenues', 'cities', 'categories'));
    }

    public function index(Request $request)
    {
        $query = Venue::where('status', 'active');

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

        $venues = $query->latest()->paginate(9)->withQueryString();

        $cities = ['Douala', 'Yaoundé', 'Kribi', 'Limbe', 'Bafoussam'];
        $categories = ['Salle de fête', 'Espace vert', 'Bureau & Coworking', 'Terrasse VIP', 'Pavillon / Villa'];

        return view('venues.index', compact('venues', 'cities', 'categories'));
    }

    public function show($id)
    {
        $venue = Venue::with(['user', 'reviews.user'])->findOrFail($id);
        $similarVenues = Venue::where('category', $venue->category)
            ->where('id', '!=', $venue->id)
            ->take(3)
            ->get();

        return view('venues.show', compact('venue', 'similarVenues'));
    }

    public function create()
    {
        $cities = ['Douala', 'Yaoundé', 'Kribi', 'Limbe', 'Bafoussam'];
        $categories = ['Salle de fête', 'Espace vert', 'Bureau & Coworking', 'Terrasse VIP', 'Pavillon / Villa'];
        $availableAmenities = ['Climatisation', 'Groupe Électrogène', 'Sonorisation Haute Fidélité', 'Service Traiteur', 'Parking Sécurisé', 'Fibre Optique / Wifi', 'Écran LED Géant', 'Piscine Privée', 'Régie Lumières DJ'];

        return Inertia::render('Venues/Create', [
            'cities' => $cities,
            'categories' => $categories,
            'availableAmenities' => $availableAmenities
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'city' => 'required|string',
            'district' => 'required|string',
            'address' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'price_per_day' => 'required|numeric|min:0',
            'price_per_hour' => 'nullable|numeric|min:0',
            'description' => 'required|string',
            'amenities' => 'nullable|array',
            'main_image' => 'required|file|mimes:jpg,jpeg,png,webp|max:10240',
            'gallery' => 'nullable|array',
            'gallery.*' => 'file|mimes:jpg,jpeg,png,webp,mp4,mov,avi|max:51200',
        ]);

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

        $cities = ['Douala', 'Yaoundé', 'Kribi', 'Limbe', 'Bafoussam'];
        $categories = ['Salle de fête', 'Espace vert', 'Bureau & Coworking', 'Terrasse VIP', 'Pavillon / Villa'];
        $availableAmenities = ['Climatisation', 'Groupe Électrogène', 'Sonorisation Haute Fidélité', 'Service Traiteur', 'Parking Sécurisé', 'Fibre Optique / Wifi', 'Écran LED Géant', 'Piscine Privée', 'Régie Lumières DJ'];

        return view('venues.edit', compact('venue', 'cities', 'categories', 'availableAmenities'));
    }

    public function update(Request $request, $id)
    {
        $venue = Venue::findOrFail($id);

        if (Auth::check() && Auth::id() !== $venue->user_id && !Auth::user()->isAdmin()) {
            return redirect()->route('venues.index')->with('error', 'Action non autorisée.');
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'city' => 'required|string',
            'district' => 'required|string',
            'address' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'price_per_day' => 'required|numeric|min:0',
            'price_per_hour' => 'nullable|numeric|min:0',
            'description' => 'required|string',
            'amenities' => 'nullable|array',
            'main_image' => 'required|url',
            'gallery' => 'nullable|string',
            'status' => 'required|in:active,maintenance,booked',
        ]);

        $gallery = [];
        if (!empty($data['gallery'])) {
            $gallery = array_map('trim', explode(',', $data['gallery']));
        } else {
            $gallery = $venue->gallery_images;
        }

        $venue->update([
            'title' => $data['title'],
            'category' => $data['category'],
            'city' => $data['city'],
            'district' => $data['district'],
            'address' => $data['address'],
            'capacity' => $data['capacity'],
            'price_per_day' => $data['price_per_day'],
            'price_per_hour' => $data['price_per_hour'] ?? null,
            'description' => $data['description'],
            'amenities' => $data['amenities'] ?? [],
            'main_image' => $data['main_image'],
            'gallery_images' => $gallery,
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
