@extends('layouts.app')

@section('title', $venue->title . ' - Celebra Cameroon')

@section('content')

<!-- Flatpickr CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<!-- GLightbox CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" />
<style>
  /* Premium Show Page Styling */
  .venue-show-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* Gallery Grid (Airbnb Style) */
  .premium-gallery {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: repeat(2, 250px);
    gap: 12px;
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 3rem;
    position: relative;
    box-shadow: var(--shadow-sm);
  }
  
  .premium-gallery .main-img-wrapper {
    grid-column: 1;
    grid-row: 1 / 3;
    overflow: hidden;
  }
  
  .premium-gallery img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease, filter 0.3s ease;
    cursor: pointer;
  }
  
  .premium-gallery img:hover {
    transform: scale(1.05);
    filter: brightness(0.9);
  }
  
  .premium-gallery .sub-img-wrapper {
    overflow: hidden;
  }

  .show-all-photos-btn {
    position: absolute;
    bottom: 24px;
    right: 24px;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0,0,0,0.1);
    color: var(--text-main);
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
    z-index: 10;
  }
  
  .show-all-photos-btn:hover {
    background: white;
    transform: translateY(-2px);
  }

  /* Main Layout */
  .venue-content-layout {
    display: flex;
    gap: 4rem;
    position: relative;
    padding-bottom: 100px;
  }

  .venue-main-details {
    flex: 1;
    min-width: 0;
  }

  /* Sticky Sidebar */
  .venue-sidebar {
    width: 400px;
    position: sticky;
    top: 100px;
    align-self: flex-start;
    z-index: 20;
  }

  /* Typography & Badges */
  .venue-title {
    font-size: 2.8rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1rem;
    color: var(--text-main);
    letter-spacing: -0.02em;
  }

  .venue-meta {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    font-size: 1.05rem;
    color: var(--text-muted);
    font-weight: 500;
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--glass-border);
  }

  .badge-category {
    background: var(--primary-light);
    color: var(--primary);
    padding: 6px 14px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.85rem;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  /* Sections */
  .detail-section {
    padding: 2.5rem 0;
    border-bottom: 1px solid var(--glass-border);
  }

  .detail-section:last-child {
    border-bottom: none;
  }

  .detail-title {
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--text-main);
  }

  .description-text {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--text-muted);
    white-space: pre-line;
  }

  /* Amenities Grid */
  .amenities-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .amenity-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.05rem;
    color: var(--text-main);
    font-weight: 500;
  }

  .amenity-item i {
    font-size: 1.4rem;
    color: var(--primary);
    width: 24px;
    text-align: center;
  }

  /* Host Card */
  .host-card {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    background: var(--bg-card);
    padding: 2rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--glass-border);
    margin-top: 1.5rem;
  }

  .host-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--primary-light);
  }

  /* Booking Widget */
  .booking-widget {
    background: var(--bg-card);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    padding: 2rem;
    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  }

  .booking-price {
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--text-main);
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 1.5rem;
  }

  .booking-price span {
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-muted);
  }

  .booking-form-wrapper {
    background: var(--bg-main);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  .booking-input-group {
    display: flex;
    border-bottom: 1px solid var(--glass-border);
  }

  .booking-input {
    flex: 1;
    padding: 1rem;
    border-right: 1px solid var(--glass-border);
  }

  .booking-input:last-child {
    border-right: none;
  }

  .booking-input label {
    display: block;
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 800;
    margin-bottom: 4px;
    color: var(--text-main);
  }

  .booking-input input, .booking-input select {
    width: 100%;
    border: none;
    background: transparent;
    padding: 0;
    font-size: 1rem;
    color: var(--text-muted);
    outline: none;
  }

  /* Mobile Bottom Bar Action */
  .mobile-bottom-bar {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(10px);
    border-top: 1px solid var(--glass-border);
    padding: 1rem 1.5rem;
    z-index: 100;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
  }

  /* Responsive Breakpoints */
  @media (max-width: 1024px) {
    .venue-content-layout {
      flex-direction: column;
      gap: 2rem;
      padding-bottom: 120px; /* Space for mobile bar */
    }
    
    .venue-sidebar {
      width: 100%;
      position: static;
    }

    .premium-gallery {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 250px 250px;
    }

    .premium-gallery .main-img-wrapper {
      grid-column: 1 / 3;
      grid-row: 1;
    }

    .mobile-bottom-bar {
      display: flex;
    }
  }

  @media (max-width: 768px) {
    .venue-title {
      font-size: 2rem;
    }
    
    .premium-gallery {
      grid-template-columns: 1fr;
      grid-template-rows: 300px;
      border-radius: 12px;
    }
    
    .premium-gallery .sub-img-wrapper {
      display: none;
    }
    
    .premium-gallery .main-img-wrapper {
      grid-column: 1;
      grid-row: 1;
    }

    .amenities-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<!-- Mobile Sticky Bottom Bar -->
<div class="mobile-bottom-bar">
  <div>
    <div style="font-weight: 800; font-size: 1.2rem; color: var(--text-main);">{{ number_format($venue->price_per_day, 0, ',', ' ') }} <span style="font-size:0.85rem; font-weight:500;">FCFA / jour</span></div>
    <div style="font-size: 0.85rem; color: var(--primary); font-weight:600;"><i class="fa-solid fa-bolt"></i> Dispo</div>
  </div>
  <a href="#booking-section" class="btn btn-primary" style="padding: 0.8rem 1.5rem; border-radius: 12px;">
    Réserver
  </a>
</div>

<div class="venue-show-container" style="margin-top: 1rem;">

  <!-- Title Section -->
  <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-start;">
    <div>
      <h1 class="venue-title">{{ $venue->title }}</h1>
      <div class="venue-meta" style="border-bottom: none; padding-bottom: 0; margin-bottom: 0;">
        <span><i class="fa-solid fa-star" style="color: #f59e0b;"></i> <strong style="color:var(--text-main);">{{ number_format($venue->rating, 2) }}</strong> ({{ $venue->reviews_count }} avis)</span>
        <span style="text-decoration: underline; cursor: pointer;"><i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> {{ $venue->district }}, {{ $venue->city }} - {{ $venue->region }}</span>
      </div>
    </div>
    
    @if(Auth::check() && (Auth::id() === $venue->user_id || Auth::user()->isAdmin()))
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: flex-end;">
        <a href="{{ route('venues.edit', $venue->id) }}" class="btn btn-outline btn-sm" style="border-radius: 8px;"><i class="fa-solid fa-pen"></i> Éditer</a>
        <form action="{{ route('venues.destroy', $venue->id) }}" method="POST" onsubmit="return confirm('Supprimer cet espace définitivement ?');">
          @csrf
          @method('DELETE')
          <button type="submit" class="btn btn-ghost btn-sm" style="color:#ef4444; border-radius: 8px;"><i class="fa-solid fa-trash"></i></button>
        </form>
      </div>
    @endif
  </div>

  <!-- Premium Gallery -->
  <div class="premium-gallery">
    <div class="main-img-wrapper">
      <a href="{{ $venue->main_image }}" class="glightbox" data-gallery="venue-gallery" data-title="{{ $venue->title }}">
        <img src="{{ $venue->main_image }}" alt="{{ $venue->title }}">
      </a>
    </div>
    
    @php
      $gallery = is_array($venue->gallery_images) ? $venue->gallery_images : [];
      // Need 4 images to fill the Pinterest grid. If not enough, fallback gracefully.
      $displayImgs = array_slice($gallery, 0, 4);
    @endphp

    @foreach($displayImgs as $idx => $img)
      <div class="sub-img-wrapper" style="{{ $idx === 1 ? 'border-top-right-radius: 20px;' : ($idx === 3 ? 'border-bottom-right-radius: 20px;' : '') }}">
        <!-- If it's a video, just show a thumbnail or video tag, for now assuming image -->
        @if(Str::endsWith($img, ['.mp4', '.mov', '.avi']))
          <a href="{{ $img }}" class="glightbox" data-gallery="venue-gallery" data-type="video" style="display: block; width: 100%; height: 100%;">
            <video src="{{ $img }}" style="width: 100%; height: 100%; object-fit: cover;" muted autoplay loop></video>
          </a>
        @else
          <a href="{{ $img }}" class="glightbox" data-gallery="venue-gallery" style="display: block; width: 100%; height: 100%;">
            <img src="{{ $img }}" alt="Gallery Image">
          </a>
        @endif
      </div>
    @endforeach

    <!-- Hidden images for the lightbox if there are more than 4 -->
    <div style="display: none;">
      @foreach(array_slice($gallery, 4) as $hiddenImg)
        @if(Str::endsWith($hiddenImg, ['.mp4', '.mov', '.avi']))
          <a href="{{ $hiddenImg }}" class="glightbox" data-gallery="venue-gallery" data-type="video"></a>
        @else
          <a href="{{ $hiddenImg }}" class="glightbox" data-gallery="venue-gallery"></a>
        @endif
      @endforeach
    </div>

    @if(count($gallery) > 0 || $venue->main_image)
      <button class="show-all-photos-btn" onclick="document.querySelector('.glightbox').click()">
        <i class="fa-solid fa-images"></i> Afficher toutes les photos
      </button>
    @endif
  </div>

  <div class="venue-content-layout">
    <!-- Left Column: Details -->
    <div class="venue-main-details">
      
      <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 2rem; border-bottom: 1px solid var(--glass-border);">
        <div>
          <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-main);">
            Proposé par {{ explode(' ', trim($venue->user->name))[0] }}
          </h2>
          <div style="display: flex; gap: 1rem; color: var(--text-muted);">
            <span><i class="fa-solid fa-users"></i> {{ $venue->capacity }} invités max</span>
            <span class="badge-category"><i class="fa-solid fa-champagne-glasses"></i> {{ $venue->category }}</span>
          </div>
        </div>
        <img src="{{ $venue->user->avatar ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 1px solid var(--glass-border);" alt="Hôte">
      </div>

      <!-- Description -->
      <div class="detail-section">
        <h3 class="detail-title">À propos de ce lieu</h3>
        <p class="description-text">{{ $venue->description }}</p>
      </div>

      <!-- Amenities -->
      <div class="detail-section">
        <h3 class="detail-title">Ce que propose ce lieu</h3>
        <div class="amenities-grid">
          @if($venue->amenities && count($venue->amenities) > 0)
            @foreach($venue->amenities as $amenity)
              <div class="amenity-item">
                <i class="fa-solid fa-check text-emerald-500"></i>
                {{ $amenity }}
              </div>
            @endforeach
          @else
            <p style="color: var(--text-muted); grid-column: 1 / -1;">Équipements standards de l'hôte.</p>
          @endif
        </div>
      </div>

      <!-- Enhanced Host Profile -->
      <div class="detail-section">
        <div class="host-card">
          <img src="{{ $venue->user->avatar ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }}" class="host-avatar" alt="Hôte">
          <div>
            <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 0.2rem;">Hôte : {{ $venue->user->name }}</h3>
            <p style="color: var(--text-muted); margin-bottom: 1rem;">Membre depuis {{ $venue->user->created_at->format('M Y') }}</p>
            
            <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem;">
              <span style="display:flex; align-items:center; gap:0.5rem; font-weight:600;"><i class="fa-solid fa-star" style="color:#f59e0b;"></i> 12 Avis</span>
              <span style="display:flex; align-items:center; gap:0.5rem; font-weight:600;"><i class="fa-solid fa-shield-check" style="color:var(--primary);"></i> Identité vérifiée</span>
            </div>

            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <a href="{{ route('messages.index', ['contact' => $venue->user_id, 'venue_id' => $venue->id]) }}" class="btn btn-outline" style="border-radius: 8px;">
                <i class="fa-solid fa-paper-plane"></i> Message
              </a>
              <button class="btn" style="background:#ecfdf5; color:var(--primary); border:none; border-radius: 8px;">
                <i class="fa-solid fa-video"></i> Visite Virtuelle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column: Booking Widget -->
    <div class="venue-sidebar" id="booking-section">
      <div class="booking-widget">
        <div class="booking-price">
          {{ number_format($venue->price_per_day, 0, ',', ' ') }} <span>FCFA / nuit</span>
        </div>

        <form action="{{ route('bookings.store') }}" method="POST">
          @csrf
          <input type="hidden" name="venue_id" value="{{ $venue->id }}">
          
          <div class="booking-form-wrapper">
            <div class="booking-input-group">
              <div class="booking-input">
                <label>Arrivée</label>
                <input type="text" name="start_date" id="calc-start-date" placeholder="Sélectionner..." required>
              </div>
              <div class="booking-input">
                <label>Départ</label>
                <input type="text" name="end_date" id="calc-end-date" placeholder="Sélectionner..." required>
              </div>
            </div>
            <div class="booking-input-group" style="border-bottom: none;">
              <div class="booking-input">
                <label>Événement</label>
                <select name="event_type" required>
                  <option value="Mariage">Mariage</option>
                  <option value="Anniversaire">Anniversaire</option>
                  <option value="Conférence">Conférence</option>
                  <option value="Cocktail">Cocktail VIP</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1.1rem; border-radius: 12px; margin-bottom: 1rem;">
            Réserver
          </button>
          
          <div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem;">
            Aucun montant ne vous sera débité pour le moment
          </div>

          <!-- Price Calculation Preview -->
          <div style="display: flex; flex-direction: column; gap: 0.8rem; font-size: 1rem; color: var(--text-main);">
            <div style="display: flex; justify-content: space-between;">
              <span style="text-decoration: underline;">Prix x <span id="calc-days-count">1</span> jour(s)</span>
              <span><span id="calc-subtotal">{{ number_format($venue->price_per_day, 0, ',', ' ') }}</span> FCFA</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="text-decoration: underline;">Frais de service</span>
              <span>0 FCFA</span>
            </div>
            <hr style="border:none; border-top: 1px solid var(--glass-border); margin: 0.5rem 0;">
            <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.2rem;">
              <span>Total estimé</span>
              <span><span id="calc-total-price">{{ number_format($venue->price_per_day, 0, ',', ' ') }}</span> FCFA</span>
            </div>
          </div>

        </form>
      </div>

      <!-- Secondary Action -->
      <button onclick="document.getElementById('visit-modal').style.display='flex'" class="btn btn-ghost" style="width: 100%; margin-top: 1.5rem; color: var(--text-muted); font-weight: 600;">
        <i class="fa-solid fa-flag"></i> Signaler ou demander une visite
      </button>
    </div>
  </div>
</div>

<!-- Scripts for dynamic booking calculation and Flatpickr -->
@section('scripts')
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script src="https://npmcdn.com/flatpickr/dist/l10n/fr.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const startInput = document.getElementById('calc-start-date');
    const endInput = document.getElementById('calc-end-date');
    const daysCount = document.getElementById('calc-days-count');
    const subtotal = document.getElementById('calc-subtotal');
    const totalPrice = document.getElementById('calc-total-price');
    const basePrice = {{ (int) $venue->price_per_day }};
    
    // Get booked dates from backend
    const bookedDates = @json($bookedDates ?? []);
    
    // Initialize Flatpickr
    const fpStart = flatpickr(startInput, {
      locale: "fr",
      minDate: "today",
      disable: bookedDates,
      dateFormat: "Y-m-d",
      onChange: function(selectedDates, dateStr, instance) {
        fpEnd.set('minDate', dateStr);
        updateCalc();
      }
    });

    const fpEnd = flatpickr(endInput, {
      locale: "fr",
      minDate: "today",
      disable: bookedDates,
      dateFormat: "Y-m-d",
      onChange: function(selectedDates, dateStr, instance) {
        updateCalc();
      }
    });
    
    function formatMoney(n) {
      return n.toLocaleString('fr-FR');
    }

    function updateCalc() {
      if(!startInput.value || !endInput.value) return;
      const start = new Date(startInput.value);
      const end = new Date(endInput.value);
      
      const diffTime = Math.abs(end - start);
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Minimum 1 day
      if (diffDays === 0) diffDays = 1;
      
      daysCount.innerText = diffDays;
      const total = basePrice * diffDays;
      subtotal.innerText = formatMoney(total);
      totalPrice.innerText = formatMoney(total);
    }
  });
</script>

<!-- GLightbox JS -->
<script src="https://cdn.jsdelivr.net/npm/glightbox/dist/js/glightbox.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const lightbox = GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      zoomable: true
    });
  });
</script>
<!-- Schedule Visit Modal -->
<div id="visit-modal" class="modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); backdrop-filter:blur(5px); z-index:1000; justify-content:center; align-items:center;">
  <div style="background: var(--bg-card); padding: 2.5rem; border-radius: var(--radius-lg); max-width: 500px; width: 90%; position:relative; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3 style="font-weight: 800; font-size:1.4rem;">Rendez-vous / Visite</h3>
      <button onclick="document.getElementById('visit-modal').style.display='none'" style="background:none; border:none; font-size:1.8rem; cursor:pointer; color:var(--text-muted);">&times;</button>
    </div>

    <form action="{{ route('appointments.store') }}" method="POST" style="display: flex; flex-direction: column; gap: 1rem;">
      @csrf
      <input type="hidden" name="venue_id" value="{{ $venue->id }}">

      <div class="form-group" style="display:flex; flex-direction:column; gap:0.5rem;">
        <label class="form-label" style="font-weight:600; font-size:0.9rem;">Type de visite</label>
        <select name="type" class="form-control" required style="padding:0.8rem; border-radius:8px; border:1px solid var(--glass-border);">
          <option value="physical_visit">Visite physique sur place (Douala/Yaoundé...)</option>
          <option value="video_call">Visite virtuelle guidée par Appel Vidéo</option>
        </select>
      </div>

      <div class="form-group" style="display:flex; flex-direction:column; gap:0.5rem;">
        <label class="form-label" style="font-weight:600; font-size:0.9rem;">Date & Heure souhaitée</label>
        <input type="datetime-local" name="scheduled_at" class="form-control" required style="padding:0.8rem; border-radius:8px; border:1px solid var(--glass-border);">
      </div>

      <div class="form-group" style="display:flex; flex-direction:column; gap:0.5rem;">
        <label class="form-label" style="font-weight:600; font-size:0.9rem;">Notes (Optionnel)</label>
        <textarea name="notes" class="form-control" rows="3" placeholder="Ex: Je souhaite tester l'éclairage nocturne..." style="padding:0.8rem; border-radius:8px; border:1px solid var(--glass-border);"></textarea>
      </div>

      <button type="submit" class="btn btn-primary" style="margin-top: 1rem; padding:1rem; border-radius:12px; font-weight:700;">
        Confirmer la demande
      </button>
    </form>
  </div>
</div>
@endsection
