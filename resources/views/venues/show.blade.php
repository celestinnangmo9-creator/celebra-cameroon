@extends('layouts.app')

@section('title', $venue->title . ' - Celebra Cameroon')

@section('content')
<div class="container">

  <!-- Breadcrumb & Top Controls -->
  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
    <div style="font-size: 0.9rem; color: var(--text-muted);">
      <a href="{{ route('home') }}">Accueil</a> / 
      <a href="{{ route('venues.index', ['city' => $venue->city]) }}">{{ $venue->city }}</a> / 
      <span style="color: var(--text-main); font-weight: 600;">{{ $venue->title }}</span>
    </div>

    @if(Auth::check() && (Auth::id() === $venue->user_id || Auth::user()->isAdmin()))
      <div style="display: flex; gap: 0.5rem;">
        <a href="{{ route('venues.edit', $venue->id) }}" class="btn btn-outline btn-sm"><i class="fa-solid fa-pen"></i> Modifier mon annonce</a>
        <form action="{{ route('venues.destroy', $venue->id) }}" method="POST" onsubmit="return confirm('Voulez-vous vraiment supprimer cet espace ?');">
          @csrf
          @method('DELETE')
          <button type="submit" class="btn btn-ghost btn-sm" style="color:#ef4444;"><i class="fa-solid fa-trash"></i> Supprimer</button>
        </form>
      </div>
    @endif
  </div>

  <!-- Venue Title & Location Banner -->
  <div style="margin-bottom: 1.5rem;">
    <h1 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 0.5rem;">{{ $venue->title }}</h1>
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: center; color: var(--text-muted); font-weight: 500;">
      <span><i class="fa-solid fa-location-dot" style="color:var(--primary);"></i> {{ $venue->address }}, {{ $venue->district }} - {{ $venue->city }}</span>
      <span><i class="fa-solid fa-users" style="color:var(--primary);"></i> Capacité: <strong>{{ $venue->capacity }} invités</strong></span>
      <span><i class="fa-solid fa-star" style="color:#f59e0b;"></i> {{ number_format($venue->rating, 2) }} ({{ $venue->reviews_count }} avis)</span>
      <span class="logo-badge" style="background:var(--primary-light); color:var(--primary); font-size:0.85rem; padding:4px 12px;">{{ $venue->category }}</span>
    </div>
  </div>

  <!-- Image Gallery Section -->
  <div class="gallery-grid" style="border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 2.5rem; height: 420px;">
    <div>
      <img src="{{ $venue->main_image }}" alt="{{ $venue->title }}" style="width: 100%; height: 100%; object-fit: cover;">
    </div>

    <div style="display: flex; flex-direction: column; gap: 1rem;">
      @if(!empty($venue->gallery_images) && is_array($venue->gallery_images))
        @foreach($venue->gallery_images as $img)
          <img src="{{ $img }}" alt="Galerie" style="width: 100%; height: calc(50% - 0.5rem); object-fit: cover; border-radius: 8px;">
        @endforeach
      @else
        <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80" alt="Galerie 1" style="width: 100%; height: calc(50% - 0.5rem); object-fit: cover; border-radius: 8px;">
        <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80" alt="Galerie 2" style="width: 100%; height: calc(50% - 0.5rem); object-fit: cover; border-radius: 8px;">
      @endif
    </div>
  </div>

  <!-- Details & Booking Sidebar Layout -->
  <div class="layout-main-sidebar">
    
    <!-- Left Column: Details -->
    <div>
      <!-- Description Card -->
      <div style="background: var(--bg-card); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); margin-bottom: 2rem;">
        <h2 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 1rem;">À propos de cet espace</h2>
        <p style="white-space: pre-line; line-height: 1.7; color: var(--text-main);">{{ $venue->description }}</p>
      </div>

      <!-- Amenities Card -->
      <div style="background: var(--bg-card); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); margin-bottom: 2rem;">
        <h2 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 1.2rem;">Équipements & Prestations</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
          @if($venue->amenities)
            @foreach($venue->amenities as $amenity)
              <div style="display: flex; align-items: center; gap: 0.75rem; background: var(--bg-main); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-weight: 600; font-size: 0.9rem;">
                <i class="fa-solid fa-circle-check" style="color: var(--primary);"></i>
                <span>{{ $amenity }}</span>
              </div>
            @endforeach
          @else
            <div style="color: var(--text-muted);">Équipements standards fournis par le propriétaire.</div>
          @endif
        </div>
      </div>

      <!-- Host Card -->
      <div style="background: var(--bg-card); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); margin-bottom: 2rem;">
        <h2 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 1.2rem;">Propriétaire de l'espace</h2>
        <div style="display: flex; gap: 1.5rem; align-items: center;">
          <img src="{{ $venue->user->avatar ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }}" alt="{{ $venue->user->name }}" style="width: 75px; height: 75px; border-radius: 50%; object-fit: cover;">
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 700;">{{ $venue->user->name }}</h3>
            <p style="font-size: 0.85rem; color: var(--primary); font-weight: 600; margin-bottom: 0.35rem;"><i class="fa-solid fa-shield-check"></i> Hôte Vérifié Celebra</p>
            <p style="font-size: 0.9rem; color: var(--text-muted);">{{ $venue->user->bio ?? 'Propriétaire professionnel disponible pour vos visites et événements.' }}</p>
          </div>
        </div>

        <!-- Interactive Direct Communication Buttons -->
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;">
          <a href="{{ route('messages.index', ['contact' => $venue->user_id, 'venue_id' => $venue->id]) }}" class="btn btn-outline" style="flex:1;">
            <i class="fa-solid fa-paper-plane"></i> Message direct
          </a>
          <button onclick="startSimulatedCall('{{ $venue->user->name }}', 'audio')" class="btn btn-ghost" style="background:#ecfdf5; color:var(--primary);" title="Appeler">
            <i class="fa-solid fa-phone"></i> Appel Audio
          </button>
          <button onclick="startSimulatedCall('{{ $venue->user->name }}', 'video')" class="btn btn-ghost" style="background:#fef3c7; color:var(--accent);" title="Appel Vidéo">
            <i class="fa-solid fa-video"></i> Appel Vidéo
          </button>
        </div>
      </div>

      <!-- Customer Reviews -->
      <div style="background: var(--bg-card); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border);">
        <h2 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 1.2rem;">Avis des Clients</h2>
        @if($venue->reviews->isEmpty())
          <p style="color: var(--text-muted);">Aucun avis posté pour le moment. Soyez le premier à réserver et donner votre avis !</p>
        @else
          @foreach($venue->reviews as $review)
            <div style="border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <strong>{{ $review->user->name }}</strong>
                <span style="color:#f59e0b;"><i class="fa-solid fa-star"></i> {{ $review->rating }}/5</span>
              </div>
              <p style="font-size: 0.9rem; color: var(--text-muted);">{{ $review->comment }}</p>
            </div>
          @endforeach
        @endif
      </div>
    </div>

    <!-- Right Column: Booking Card & Visits -->
    <div>
      <div style="background: var(--bg-card); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); box-shadow: var(--shadow-hover); position: sticky; top: 100px;">
        <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1.5rem;">
          <div>
            <span style="font-size: 1.8rem; font-weight: 800; color: var(--accent);">{{ number_format($venue->price_per_day, 0, ',', ' ') }} FCFA</span>
            <span style="color: var(--text-muted); font-size: 0.9rem;">/ jour</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600;">
            <i class="fa-solid fa-circle-check"></i> Disponible
          </div>
        </div>

        <form action="{{ route('bookings.store') }}" method="POST" style="display: flex; flex-direction: column; gap: 1rem;">
          @csrf
          <input type="hidden" name="venue_id" value="{{ $venue->id }}">

          <div class="form-group">
            <label class="form-label">Date de début</label>
            <input type="date" name="start_date" id="calc-start-date" data-price-day="{{ $venue->price_per_day }}" class="form-control" required min="{{ date('Y-m-d') }}">
          </div>

          <div class="form-group">
            <label class="form-label">Date de fin</label>
            <input type="date" name="end_date" id="calc-end-date" class="form-control" required min="{{ date('Y-m-d') }}">
          </div>

          <div class="form-group">
            <label class="form-label">Nombre d'invités</label>
            <input type="number" name="guest_count" class="form-control" value="100" max="{{ $venue->capacity }}" required>
          </div>

          <div class="form-group">
            <label class="form-label">Type d'événement</label>
            <select name="event_type" class="form-control" required>
              <option value="Mariage">Mariage</option>
              <option value="Anniversaire">Anniversaire</option>
              <option value="Conférence / Séminaire">Conférence / Séminaire</option>
              <option value="Cocktail VIP">Cocktail VIP</option>
              <option value="Garden Party">Garden Party</option>
            </select>
          </div>

          <!-- Dynamic Calculation Summary -->
          <div style="background: var(--bg-main); padding: 1rem; border-radius: var(--radius-md); font-size: 0.9rem; display: flex; flex-direction: column; gap: 0.5rem; margin: 0.5rem 0;">
            <div style="display: flex; justify-content: space-between;">
              <span>Durée estimée:</span>
              <strong id="calc-days-count">1 jour</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.05rem; color: var(--accent); border-top: 1px dashed var(--glass-border); padding-top: 0.5rem;">
              <span>Total Estimé:</span>
              <span id="calc-total-price">{{ number_format($venue->price_per_day, 0, ',', ' ') }} FCFA</span>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem;">
            <i class="fa-solid fa-calendar-check"></i> Réserver maintenant
          </button>
        </form>

        <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid var(--glass-border);">

        <!-- Visit Appointment Trigger -->
        <button onclick="document.getElementById('visit-modal').style.display='flex'" class="btn btn-outline" style="width: 100%;">
          <i class="fa-solid fa-eye"></i> Demander une visite du lieu
        </button>
      </div>
    </div>

  </div>

</div>

<!-- Schedule Visit Modal -->
<div id="visit-modal" class="modal-overlay">
  <div style="background: var(--bg-card); padding: 2rem; border-radius: var(--radius-lg); max-width: 500px; width: 90%;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3 style="font-weight: 800;">Demander un Rendez-vous de Visite</h3>
      <button onclick="document.getElementById('visit-modal').style.display='none'" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:var(--text-muted);">&times;</button>
    </div>

    <form action="{{ route('appointments.store') }}" method="POST" style="display: flex; flex-direction: column; gap: 1rem;">
      @csrf
      <input type="hidden" name="venue_id" value="{{ $venue->id }}">

      <div class="form-group">
        <label class="form-label">Type de visite</label>
        <select name="type" class="form-control" required>
          <option value="physical_visit">Visite physique sur place (Douala/Yaoundé...)</option>
          <option value="video_call">Visite virtuelle guidée par Appel Vidéo</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Date & Heure souhaitée</label>
        <input type="datetime-local" name="scheduled_at" class="form-control" required>
      </div>

      <div class="form-group">
        <label class="form-label">Notes ou exigences particulières</label>
        <textarea name="notes" class="form-control" rows="3" placeholder="Ex: Souhaite tester le groupe électrogène et voir l'éclairage nocturne..."></textarea>
      </div>

      <button type="submit" class="btn btn-primary" style="margin-top: 0.5rem;">
        Confirmer le rendez-vous
      </button>
    </form>
  </div>
</div>

@endsection
