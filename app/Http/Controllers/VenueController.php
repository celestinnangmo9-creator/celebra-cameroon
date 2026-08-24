<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Services\VenueService;

class VenueController extends Controller
{
    protected $venueService;

    public function __construct(VenueService $venueService)
    {
        $this->venueService = $venueService;
    }

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
            'categories' => $categories,
            'filters' => $request->only(['search', 'region', 'city', 'category', 'capacity', 'min_price', 'max_price'])
        ]);
    }

    public function show($id)
    {
        $venue = Venue::with(['user', 'reviews.user'])->findOrFail($id);
        
        // Increment views count
        $venue->increment('views_count');

        $similarVenues = Venue::where('category', $venue->category)
            ->where('id', '!=', $venue->id)
            ->take(3)
            ->get();

        $bookedDates = app(\App\Services\BookingService::class)->getUnavailableDates($venue->id);

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

        if (Auth::user()->subscription_status === 'expired') {
            return redirect()->route('dashboard')->with('error', 'Votre abonnement a expiré. Veuillez le renouveler pour publier de nouvelles salles.');
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

        if (Auth::user()->subscription_status === 'expired') {
            return redirect()->route('dashboard')->with('error', 'Votre abonnement a expiré. Veuillez le renouveler pour publier de nouvelles salles.');
        }

        $venue = $this->venueService->createVenue(
            $request->validated(),
            Auth::id() ?? 1,
            $request->file('main_image'),
            $request->file('gallery') ?? []
        );

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

        $this->venueService->updateVenue(
            $venue,
            $request->validated(),
            $request->file('main_image'),
            $request->file('gallery') ?? []
        );

        return redirect()->route('venues.show', $venue->id)->with('success', 'L\'annonce a été mise à jour avec succès.');
    }

    public function destroy($id)
    {
        $venue = Venue::findOrFail($id);

        if (Auth::check() && Auth::id() !== $venue->user_id && !Auth::user()->isAdmin()) {
            return redirect()->route('venues.index')->with('error', 'Action non autorisée.');
        }

        $this->venueService->deleteVenue($venue);

        return redirect()->route('venues.index')->with('success', 'L\'espace a été supprimé.');
    }

    public function stats($id)
    {
        $venue = Venue::with('blockedDates')->findOrFail($id);

        if (Auth::check() && Auth::id() !== $venue->user_id && !Auth::user()->isAdmin()) {
            return redirect()->route('venues.index')->with('error', 'Action non autorisée.');
        }

        $stats = $this->venueService->getVenueStats($venue);
        
        $bookings = \App\Models\Booking::with('user')->where('venue_id', $venue->id)->latest()->get();

        return Inertia::render('Venues/Stats', [
            'venue' => $venue,
            'stats' => $stats,
            'bookings' => $bookings,
            'blockedDates' => $venue->blockedDates
        ]);
    }

    public function blockDates(Request $request, $id)
    {
        $venue = Venue::findOrFail($id);

        if (Auth::id() !== $venue->user_id && !Auth::user()->isAdmin()) {
            return back()->with('error', 'Action non autorisée.');
        }

        $request->validate([
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string'
        ]);

        $this->venueService->blockDates($venue, $request->all());

        return back()->with('success', 'Les dates ont été bloquées avec succès.');
    }

    public function unblockDate($id, $blockedDateId)
    {
        $venue = Venue::findOrFail($id);

        if (Auth::id() !== $venue->user_id && !Auth::user()->isAdmin()) {
            return back()->with('error', 'Action non autorisée.');
        }

        $this->venueService->unblockDate($venue, $blockedDateId);

        return back()->with('success', 'Le blocage a été retiré.');
    }
}

