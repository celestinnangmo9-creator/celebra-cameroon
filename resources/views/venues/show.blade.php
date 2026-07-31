@extends('layouts.app')
@php $hideMobileNav = true; @endphp

@section('title', $venue->title . ' - Celebra Cameroon')

@section('content')

<!-- Flatpickr CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<!-- GLightbox CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" />
<style>
  /* Immersive Background Orbs */
  .ambient-bg {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
  }
  .ambient-bg::before, .ambient-bg::after {
    content: '';
    position: absolute;
    width: 60vw; height: 60vw;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.25;
    animation: drift 20s infinite alternate ease-in-out;
  }
  .ambient-bg::before {
    background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
    top: -10%; left: -10%;
  }
  .ambient-bg::after {
    background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
    bottom: -10%; right: -10%;
    animation-delay: -10s;
  }
  @keyframes drift {
    0% { transform: translate(0,0) scale(1); }
    100% { transform: translate(10%, 10%) scale(1.1); }
  }

  /* Ultra Premium Show Page Styling */
  .venue-show-container {
    max-width: 1300px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    position: relative;
  }

  /* Gallery Grid (Next-Gen Airbnb Style) */
  .premium-gallery {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: repeat(2, 280px);
    gap: 16px;
    border-radius: 32px;
    overflow: hidden;
    margin-bottom: 4rem;
    position: relative;
    box-shadow: 0 20px 50px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.6);
  }
  
  .premium-gallery[data-images="0"] {
    grid-template-columns: 1fr;
    grid-template-rows: 600px;
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
    transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.4s ease;
    cursor: pointer;
  }
  
  .premium-gallery img:hover {
    transform: scale(1.1);
    filter: brightness(0.7);
  }
  
  .premium-gallery .sub-img-wrapper {
    overflow: hidden;
    position: relative;
  }

  /* Fancy Gallery Button */
  .show-all-photos-btn {
    position: absolute;
    bottom: 30px;
    right: 30px;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    color: #111;
    padding: 0.8rem 1.8rem;
    border-radius: 100px;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .show-all-photos-btn:hover {
    background: #fff;
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  }

  /* Main Layout */
  .venue-content-layout {
    display: flex;
    gap: 5rem;
    position: relative;
    padding-bottom: 120px;
  }

  .venue-main-details {
    flex: 1.5;
    min-width: 0;
  }

  /* Sticky Sidebar & Widget */
  .venue-sidebar {
    flex: 1;
    min-width: 380px;
    max-width: 450px;
    position: sticky;
    top: 120px;
    align-self: flex-start;
    z-index: 20;
  }

  .booking-widget-wrapper {
    position: relative;
  }
  
  /* Glowing aura around booking widget */
  .booking-widget-wrapper::before {
    content: '';
    position: absolute;
    inset: -15px;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    border-radius: 40px;
    filter: blur(25px);
    opacity: 0.2;
    z-index: -1;
    animation: pulseAura 4s ease-in-out infinite alternate;
  }
  
  @keyframes pulseAura {
    from { opacity: 0.15; transform: scale(0.98); filter: blur(20px); }
    to { opacity: 0.3; transform: scale(1.02); filter: blur(30px); }
  }

  /* Typography & Badges */
  .venue-title {
    font-size: 3.5rem;
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    background: linear-gradient(to right, #111827 20%, var(--primary) 80%, var(--accent) 100%);
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: shine 5s linear infinite;
    letter-spacing: -0.03em;
  }
  
  @keyframes shine {
    to { background-position: 200% center; }
  }

  .venue-meta {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    font-size: 1.15rem;
    color: var(--text-muted);
    font-weight: 500;
    margin-bottom: 3rem;
    padding-bottom: 2.5rem;
    border-bottom: 1px solid var(--glass-border);
  }

  .badge-category {
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(10px);
    color: var(--primary);
    padding: 10px 20px;
    border-radius: 100px;
    font-weight: 800;
    font-size: 0.95rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(5, 150, 105, 0.2);
    box-shadow: 0 8px 20px rgba(5, 150, 105, 0.1);
    transition: all 0.3s ease;
  }
  
  .badge-category:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(5, 150, 105, 0.15);
  }

  /* Sections */
  .detail-section {
    padding: 3.5rem 0;
    border-bottom: 1px solid var(--glass-border);
  }

  .detail-section:last-child {
    border-bottom: none;
  }

  .detail-title {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 2rem;
    color: var(--text-main);
    letter-spacing: -0.02em;
    position: relative;
    display: inline-block;
  }
  
  .detail-title::after {
    content: '';
    position: absolute;
    bottom: -8px; left: 0;
    width: 40%;
    height: 4px;
    background: var(--primary);
    border-radius: 4px;
  }

  .description-text {
    font-size: 1.2rem;
    line-height: 1.9;
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
    gap: 1.2rem;
    font-size: 1.15rem;
    color: var(--text-main);
    font-weight: 700;
    padding: 1.2rem 1.5rem;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .amenity-item:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 15px 35px rgba(0,0,0,0.08);
    background: #fff;
    border-color: var(--primary);
  }

  .amenity-item i {
    font-size: 1.6rem;
    color: var(--primary);
    width: 28px;
    text-align: center;
  }

  /* Host Card - Ultra Modern */
  .host-card {
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4));
    backdrop-filter: blur(25px);
    padding: 3rem;
    border-radius: 32px;
    border: 1px solid rgba(255,255,255,0.8);
    margin-top: 2rem;
    box-shadow: 0 30px 60px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.5);
    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  
  .host-card:hover {
    transform: translateY(-10px) rotateX(2deg) rotateY(-2deg);
    box-shadow: 0 40px 80px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.8);
  }

  .host-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 5px solid white;
    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
  }

  /* Booking Widget */
  .booking-widget {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 32px;
    padding: 3rem 2.5rem;
    box-shadow: 0 30px 60px -12px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,1);
    position: relative;
    overflow: hidden;
  }
  
  .booking-widget::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 10px;
    background: linear-gradient(90deg, var(--primary), var(--accent), var(--primary));
    background-size: 200% auto;
    animation: shine 3s linear infinite;
  }

  .booking-price {
    font-size: 2.8rem;
    font-weight: 900;
    color: var(--text-main);
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 2.5rem;
    letter-spacing: -0.04em;
  }

  .booking-price span {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text-muted);
  }

  .booking-form-wrapper {
    background: rgba(255,255,255,0.7);
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 2rem;
    box-shadow: inset 0 2px 10px rgba(0,0,0,0.02);
  }

  .booking-input-group {
    display: flex;
    border-bottom: 1px solid rgba(0,0,0,0.08);
  }

  .booking-input {
    flex: 1;
    padding: 1.2rem;
    border-right: 1px solid rgba(0,0,0,0.08);
    transition: background 0.3s ease;
  }
  
  .booking-input:hover {
    background: rgba(255,255,255,1);
  }

  .booking-input:last-child {
    border-right: none;
  }

  .booking-input label {
    display: block;
    font-size: 0.8rem;
    text-transform: uppercase;
    font-weight: 900;
    margin-bottom: 8px;
    color: var(--text-main);
    letter-spacing: 0.5px;
  }

  .booking-input input, .booking-input select {
    width: 100%;
    border: none;
    background: transparent;
    padding: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-muted);
    outline: none;
  }
  
  .btn-premium-book {
    width: 100%; 
    padding: 1.4rem; 
    font-size: 1.25rem; 
    font-weight: 900; 
    border-radius: 20px; 
    margin-bottom: 1.5rem; 
    background: linear-gradient(135deg, var(--primary), var(--accent));
    color: white;
    border: none;
    box-shadow: 0 15px 35px rgba(5,150,105,0.4);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    overflow: hidden;
  }
  
  .btn-premium-book::after {
    content: '';
    position: absolute;
    top: -50%; left: -50%;
    width: 200%; height: 200%;
    background: rgba(255,255,255,0.2);
    transform: rotate(45deg) translateY(100%);
    transition: transform 0.6s ease;
  }
  
  .btn-premium-book:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 45px rgba(5,150,105,0.5);
  }
  
  .btn-premium-book:hover::after {
    transform: rotate(45deg) translateY(-100%);
  }
  
  /* Mobile Bottom Bar Action */
  .mobile-bottom-bar-action {
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
      gap: 3rem;
      padding-bottom: 120px;
    }
    
    .venue-sidebar {
      width: 100%;
      max-width: 100%;
      position: static;
    }

    .premium-gallery {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 300px 300px;
    }

    .premium-gallery .main-img-wrapper {
      grid-column: 1 / 3;
      grid-row: 1;
      border-radius: 32px 32px 0 0;
    }
    
    .mobile-bottom-bar-action {
      display: flex;
    }
  }

  @media (max-width: 768px) {
    .venue-title {
      font-size: 2.2rem;
    }
    
    .premium-gallery {
      grid-template-columns: 1fr;
      grid-template-rows: 400px;
      border-radius: 20px;
    }
    
    .premium-gallery .sub-img-wrapper {
      display: none;
    }
    
    .premium-gallery .main-img-wrapper {
      grid-column: 1;
      grid-row: 1;
      border-radius: 20px;
    }

    .amenities-grid {
      grid-template-columns: 1fr;
    }
    
    .host-card {
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 2rem;
    }
  }
</style>

<!-- Background Ambience -->
<div class="ambient-bg"></div>

<!-- Mobile Sticky Bottom Bar -->
<div class="mobile-bottom-bar-action">
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
  @php
    $gallery = is_array($venue->gallery_images) ? $venue->gallery_images : [];
    $imgCount = count($gallery);
  @endphp
  <div class="premium-gallery" data-images="{{ $imgCount }}" data-aos="zoom-in" data-aos-duration="800">
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
      <div class="detail-section" data-aos="fade-up">
        <h3 class="detail-title">À propos de ce lieu</h3>
        <p class="description-text">{{ $venue->description }}</p>
      </div>

      <!-- Amenities -->
      <div class="detail-section" data-aos="fade-up" data-aos-delay="100">
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
      <div class="detail-section" data-aos="fade-up" data-aos-delay="200">
        <div class="host-card">
          <img src="{{ $venue->user->avatar ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }}" class="host-avatar" alt="Hôte">
          <div>
            <h3 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 0.2rem; color: var(--text-main);">Hôte : {{ $venue->user->name }}</h3>
            <p style="color: var(--text-muted); margin-bottom: 1rem; font-weight: 500;">Membre depuis {{ $venue->user->created_at->format('M Y') }}</p>
            
            <div style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1.5rem;">
              <span style="display:flex; align-items:center; gap:0.5rem; font-weight:700;"><i class="fa-solid fa-star" style="color:#f59e0b; font-size: 1.2rem;"></i> 12 Avis</span>
              <span style="display:flex; align-items:center; gap:0.5rem; font-weight:700; color: var(--primary);"><i class="fa-solid fa-shield-check" style="font-size: 1.2rem;"></i> Identité vérifiée</span>
            </div>

            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <a href="{{ route('messages.index', ['contact' => $venue->user_id, 'venue_id' => $venue->id]) }}" class="btn btn-primary" style="border-radius: 12px; padding: 0.8rem 1.5rem; box-shadow: 0 4px 15px rgba(5,150,105,0.2);">
                <i class="fa-solid fa-paper-plane"></i> Contacter
              </a>
              <button onclick="document.getElementById('visit-modal').style.display='flex'" class="btn" style="background: rgba(255,255,255,0.8); color:var(--text-main); border:1px solid var(--glass-border); border-radius: 12px; font-weight: 600; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <i class="fa-solid fa-video" style="color: var(--accent);"></i> Visite
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column: Booking Widget -->
    <div class="venue-sidebar" id="booking-section">
      <div class="booking-widget-wrapper" data-aos="fade-left" data-aos-delay="200">
        <div class="booking-widget">
        <div class="booking-price">
          {{ number_format($venue->price_per_day, 0, ',', ' ') }} <span>FCFA / nuit</span>
        </div>

        <form action="{{ route('bookings.store') }}" method="POST">
          @csrf
          <input type="hidden" name="venue_id" value="{{ $venue->id }}">
          
          <div class="booking-form-wrapper" style="box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
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
                <select name="event_type" required style="cursor: pointer; font-weight: 500;">
                  <option value="Mariage">Mariage</option>
                  <option value="Anniversaire">Anniversaire</option>
                  <option value="Conférence">Conférence</option>
                  <option value="Cocktail">Cocktail VIP</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" class="btn-premium-book">
            Demander à Réserver
          </button>
          
          <div style="text-align: center; color: var(--text-muted); font-size: 0.9rem; font-weight: 500; margin-bottom: 2rem;">
            Aucun montant ne vous sera débité pour le moment.
          </div>

          <!-- Price Calculation Preview -->
          <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 1.05rem; color: var(--text-main);">
            <div style="display: flex; justify-content: space-between;">
              <span style="text-decoration: underline; color: var(--text-muted);">Prix x <span id="calc-days-count">1</span> jour(s)</span>
              <span style="font-weight: 600;"><span id="calc-subtotal">{{ number_format($venue->price_per_day, 0, ',', ' ') }}</span> FCFA</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="text-decoration: underline; color: var(--text-muted);">Frais de service (0%)</span>
              <span style="font-weight: 600; color: var(--primary);">Offert</span>
            </div>
            <hr style="border:none; border-top: 1px dashed var(--glass-border); margin: 1rem 0;">
            <div style="display: flex; justify-content: space-between; font-weight: 900; font-size: 1.4rem;">
              <span>Total estimé</span>
              <span style="color: var(--primary);"><span id="calc-total-price">{{ number_format($venue->price_per_day, 0, ',', ' ') }}</span> FCFA</span>
            </div>
          </div>

        </form>
      </div>

      <!-- Secondary Action -->
      <button onclick="document.getElementById('visit-modal').style.display='flex'" class="btn" style="width: 100%; margin-top: 2rem; background: rgba(255,255,255,0.5); backdrop-filter: blur(10px); color: var(--text-main); font-weight: 700; border: 1px solid var(--glass-border); border-radius: 16px; padding: 1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.9)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255,255,255,0.5)'; this.style.transform='translateY(0)'">
        <i class="fa-solid fa-flag" style="margin-right: 0.5rem; color: var(--primary);"></i> Signaler ou demander une visite
      </button>
      </div>
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
