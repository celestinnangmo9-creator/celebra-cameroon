@extends('layouts.app')

@section('title', 'Celebra Cameroon - Trouver & Réserver des Salles d\'Événement au Cameroun')

@section('content')

<!-- Hero Banner -->
<section class="hero">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="hero-title">Trouvez le lieu parfait pour vos célébrations au Cameroun</h1>
    <p class="hero-subtitle">Salles de fête, jardins d'exception, terrasses VIP et bureaux privatifs à Douala, Yaoundé, Kribi et dans tout le Cameroun.</p>

    <!-- Search Box Form -->
    <form action="{{ route('venues.index') }}" method="GET" class="search-card">
      <div class="form-group">
        <label class="form-label"><i class="fa-solid fa-location-dot" style="color:var(--primary);"></i> Ville</label>
        <select name="city" class="form-control">
          <option value="">Toutes les villes</option>
          @foreach($cities as $city)
            <option value="{{ $city }}">{{ $city }}</option>
          @endforeach
        </select>
      </div>

      <div class="form-group">
        <label class="form-label"><i class="fa-solid fa-list-check" style="color:var(--primary);"></i> Type de lieu</label>
        <select name="category" class="form-control">
          <option value="">Tous les types</option>
          @foreach($categories as $category)
            <option value="{{ $category }}">{{ $category }}</option>
          @endforeach
        </select>
      </div>

      <div class="form-group">
        <label class="form-label"><i class="fa-solid fa-users" style="color:var(--primary);"></i> Invités min.</label>
        <input type="number" name="capacity" class="form-control" placeholder="Ex: 100 pers.">
      </div>

      <div class="form-group" style="align-self: flex-end;">
        <button type="submit" class="btn btn-primary" style="padding: 0.8rem 2rem; width: 100%;">
          <i class="fa-solid fa-magnifying-glass"></i> Rechercher
        </button>
      </div>
    </form>
  </div>
</section>

<!-- Categories Section -->
<section class="container" style="margin-top: 1rem;">
  <div class="section-title">Explorez par Catégorie</div>
  <div class="section-subtitle">Trouvez l'espace adapté à la taille et au prestige de votre événement.</div>

  <div class="categories-grid">
    <a href="{{ route('venues.index', ['category' => 'Salle de fête']) }}" class="category-card">
      <div class="category-icon"><i class="fa-solid fa-champagne-glasses"></i></div>
      <div>
        <div>Salles de Fête</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">Mariages & Banquets</div>
      </div>
    </a>

    <a href="{{ route('venues.index', ['category' => 'Espace vert']) }}" class="category-card">
      <div class="category-icon" style="background:#fef3c7; color:#d97706;"><i class="fa-solid fa-tree"></i></div>
      <div>
        <div>Espaces Verts</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">Jardins & Plages Kribi</div>
      </div>
    </a>

    <a href="{{ route('venues.index', ['category' => 'Terrasse VIP']) }}" class="category-card">
      <div class="category-icon" style="background:#e0e7ff; color:#4338ca;"><i class="fa-solid fa-martini-glass-citrus"></i></div>
      <div>
        <div>Terrasses VIP</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">Rooftops & Cocktails</div>
      </div>
    </a>

    <a href="{{ route('venues.index', ['category' => 'Bureau & Coworking']) }}" class="category-card">
      <div class="category-icon" style="background:#f3e8ff; color:#7e22ce;"><i class="fa-solid fa-briefcase"></i></div>
      <div>
        <div>Bureaux & Conférences</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">Séminaires & Réunions</div>
      </div>
    </a>

    <a href="{{ route('venues.index', ['category' => 'Pavillon / Villa']) }}" class="category-card">
      <div class="category-icon" style="background:#ffe4e6; color:#e11d48;"><i class="fa-solid fa-house-chimney-window"></i></div>
      <div>
        <div>Villas de Prestige</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">Piscine & Séjours VIP</div>
      </div>
    </a>
  </div>
</section>

<!-- Featured Venues Grid -->
<section class="container">
  <div style="display: flex; align-items: center; justify-content: space-between;">
    <div>
      <div class="section-title">Espaces en Vedette au Cameroun</div>
      <div class="section-subtitle">Sélectionnés pour leur standing, leurs équipements et la satisfaction client.</div>
    </div>
    <a href="{{ route('venues.index') }}" class="btn btn-outline">Voir tout le catalogue <i class="fa-solid fa-arrow-right"></i></a>
  </div>

  <div class="venues-grid">
    @foreach($featuredVenues as $venue)
      <div class="venue-card">
        <div class="venue-image-wrapper">
          <img src="{{ $venue->main_image }}" alt="{{ $venue->title }}" class="venue-image">
          <span class="venue-badge">{{ $venue->category }}</span>
          <span class="venue-rating"><i class="fa-solid fa-star" style="color:#f59e0b;"></i> {{ number_format($venue->rating, 2) }}</span>
        </div>

        <div class="venue-body">
          <div class="venue-location">
            <i class="fa-solid fa-location-dot"></i> {{ $venue->city }} ({{ $venue->district }})
          </div>
          <h3 class="venue-title">{{ $venue->title }}</h3>
          
          <div class="venue-specs">
            <span><i class="fa-solid fa-users"></i> {{ $venue->capacity }} personnes</span>
            <span><i class="fa-solid fa-shield-halved"></i> G. Électrogène</span>
          </div>

          <div class="venue-price">
            <div>
              <span class="price-val">{{ number_format($venue->price_per_day, 0, ',', ' ') }} FCFA</span>
              <span class="price-unit">/ jour</span>
            </div>
            <a href="{{ route('venues.show', $venue->id) }}" class="btn btn-primary btn-sm" style="padding: 0.4rem 1rem; font-size:0.85rem;">Découvrir</a>
          </div>
        </div>
      </div>
    @endforeach
  </div>
</section>

<!-- Latest Venues Grid -->
<section class="container" style="margin-top: 3rem;">
  <div style="display: flex; align-items: center; justify-content: space-between;">
    <div>
      <div class="section-title">Nouvelles Salles Ajoutées</div>
      <div class="section-subtitle">Découvrez les derniers espaces publiés par nos hôtes.</div>
    </div>
  </div>

  <div class="venues-grid">
    @foreach($latestVenues as $venue)
      <div class="venue-card">
        <div class="venue-image-wrapper">
          <img src="{{ $venue->main_image }}" alt="{{ $venue->title }}" class="venue-image" style="object-fit: cover;">
          <span class="venue-badge" style="background: rgba(5, 150, 105, 0.9);">Nouveau</span>
          <span class="venue-rating"><i class="fa-solid fa-star" style="color:#f59e0b;"></i> {{ number_format($venue->rating, 2) }}</span>
        </div>

        <div class="venue-body">
          <div class="venue-location">
            <i class="fa-solid fa-location-dot"></i> {{ $venue->city }} ({{ $venue->district }})
          </div>
          <h3 class="venue-title">{{ $venue->title }}</h3>
          
          <div class="venue-specs">
            <span><i class="fa-solid fa-users"></i> {{ $venue->capacity }} personnes</span>
            <span style="color:var(--text-muted);">{{ $venue->category }}</span>
          </div>

          <div class="venue-price">
            <div>
              <span class="price-val">{{ number_format($venue->price_per_day, 0, ',', ' ') }} FCFA</span>
              <span class="price-unit">/ jour</span>
            </div>
            <a href="{{ route('venues.show', $venue->id) }}" class="btn btn-outline btn-sm" style="padding: 0.4rem 1rem; font-size:0.85rem;">Voir plus</a>
          </div>
        </div>
      </div>
    @endforeach
  </div>
</section>

<!-- How it works -->
<section style="background: var(--bg-card); padding: 5rem 0; border-top: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border); margin-top: 3rem;">
  <div class="container">
    <div style="text-align: center; max-width: 700px; margin: 0 auto 3rem;">
      <h2 class="section-title">Comment fonctionne Celebra Cameroon ?</h2>
      <p class="section-subtitle">Réservez un lieu d'événement en toute tranquillité grâce à nos garanties et fonctionnalités interactives.</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
      <div style="text-align: center; padding: 2rem; background: var(--bg-main); border-radius: var(--radius-lg);">
        <div style="width: 70px; height: 70px; background: var(--primary-light); color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 1.8rem; font-weight: 800;">1</div>
        <h3 style="margin-bottom: 0.75rem;">Trouvez & Filtrez</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Recherchez par ville (Douala, Yaoundé, Kribi...), capacité, budget et équipements.</p>
      </div>

      <div style="text-align: center; padding: 2rem; background: var(--bg-main); border-radius: var(--radius-lg);">
        <div style="width: 70px; height: 70px; background: var(--accent-light); color: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 1.8rem; font-weight: 800;">2</div>
        <h3 style="margin-bottom: 0.75rem;">Discutez & Visitez</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Échangez directement avec le propriétaire en messagerie interne, passez un appel audio/vidéo ou planifiez une visite physique du lieu.</p>
      </div>

      <div style="text-align: center; padding: 2rem; background: var(--bg-main); border-radius: var(--radius-lg);">
        <div style="width: 70px; height: 70px; background: #e0e7ff; color: #4338ca; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 1.8rem; font-weight: 800;">3</div>
        <h3 style="margin-bottom: 0.75rem;">Réservez en Sécurité</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Calculez votre devis instantané et confirmez votre réservation avec paiement sécurisé ou acompte sur place.</p>
      </div>
    </div>
  </div>
</section>

@endsection
