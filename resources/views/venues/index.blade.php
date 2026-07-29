@extends('layouts.app')

@section('title', 'Catalogue des Lieux & Salles au Cameroun - Celebra Cameroon')

@section('content')
<div class="container">

  <!-- Header Banner -->
  <div style="margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
    <div>
      <h1 class="section-title">Catalogue des Lieux Événementiels</h1>
      <p class="section-subtitle">{{ $venues->total() }} espace(s) disponible(s) à la location au Cameroun</p>
    </div>

    <div>
      <a href="{{ route('venues.create') }}" class="btn btn-accent"><i class="fa-solid fa-plus"></i> Publier une salle</a>
    </div>
  </div>

  <div class="layout-sidebar-main">
    
    <!-- Filter Sidebar -->
    <aside style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); height: fit-content;">
      <h3 style="margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.5rem;">
        <i class="fa-solid fa-sliders" style="color:var(--primary);"></i> Filtres de recherche
      </h3>

      <form action="{{ route('venues.index') }}" method="GET" style="display: flex; flex-direction: column; gap: 1.2rem;">
        <!-- Keyword -->
        <div class="form-group">
          <label class="form-label">Mot-clé / Quartier</label>
          <input type="text" name="search" class="form-control" value="{{ request('search') }}" placeholder="Ex: Bonapriso, Piscine...">
        </div>

        <!-- City -->
        <div class="form-group">
          <label class="form-label">Ville</label>
          <select name="city" class="form-control">
            <option value="">Toutes les villes</option>
            @foreach($cities as $c)
              <option value="{{ $c }}" {{ request('city') == $c ? 'selected' : '' }}>{{ $c }}</option>
            @endforeach
          </select>
        </div>

        <!-- Category -->
        <div class="form-group">
          <label class="form-label">Catégorie</label>
          <select name="category" class="form-control">
            <option value="">Toutes les catégories</option>
            @foreach($categories as $cat)
              <option value="{{ $cat }}" {{ request('category') == $cat ? 'selected' : '' }}>{{ $cat }}</option>
            @endforeach
          </select>
        </div>

        <!-- Capacity -->
        <div class="form-group">
          <label class="form-label">Capacité minimale (Pers.)</label>
          <input type="number" name="capacity" class="form-control" value="{{ request('capacity') }}" placeholder="Ex: 150">
        </div>

        <!-- Min/Max Price -->
        <div class="form-group">
          <label class="form-label">Budget max / jour (FCFA)</label>
          <input type="number" name="max_price" class="form-control" value="{{ request('max_price') }}" placeholder="Ex: 300000">
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
          <i class="fa-solid fa-filter"></i> Appliquer les filtres
        </button>

        @if(request()->anyFilled(['search', 'city', 'category', 'capacity', 'max_price']))
          <a href="{{ route('venues.index') }}" class="btn btn-ghost" style="text-align: center; font-size: 0.85rem;">
            Réinitialiser les filtres
          </a>
        @endif
      </form>
    </aside>

    <!-- Main Listing Area -->
    <div>
      @if($venues->isEmpty())
        <div style="background: var(--bg-card); padding: 4rem 2rem; border-radius: var(--radius-lg); text-align: center; border: 1px solid var(--glass-border);">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
          <h3>Aucun lieu ne correspond à votre recherche</h3>
          <p style="color: var(--text-muted); margin-top: 0.5rem;">Essayez de modifier vos critères de filtrage ou sélectionnez une autre ville.</p>
          <a href="{{ route('venues.index') }}" class="btn btn-outline" style="margin-top: 1.5rem;">Voir toutes les salles</a>
        </div>
      @else
        <div class="venues-grid" style="margin-top: 0;">
          @foreach($venues as $venue)
            <div class="venue-card">
              <div class="venue-image-wrapper">
                <img src="{{ $venue->main_image }}" alt="{{ $venue->title }}" class="venue-image">
                <span class="venue-badge">{{ $venue->category }}</span>
                <span class="venue-rating"><i class="fa-solid fa-star" style="color:#f59e0b;"></i> {{ number_format($venue->rating, 2) }}</span>
              </div>

              <div class="venue-body">
                <div class="venue-location">
                  <i class="fa-solid fa-location-dot"></i> {{ $venue->city }} - {{ $venue->district }}
                </div>
                <h3 class="venue-title">{{ $venue->title }}</h3>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.8rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                  {{ $venue->description }}
                </p>
                
                <div class="venue-specs">
                  <span><i class="fa-solid fa-users"></i> {{ $venue->capacity }} max</span>
                  <span><i class="fa-solid fa-bolt"></i> G. Électrogène</span>
                </div>

                <div class="venue-price">
                  <div>
                    <span class="price-val">{{ number_format($venue->price_per_day, 0, ',', ' ') }} FCFA</span>
                    <span class="price-unit">/ jour</span>
                  </div>
                  <a href="{{ route('venues.show', $venue->id) }}" class="btn btn-primary btn-sm" style="padding: 0.4rem 1rem; font-size:0.85rem;">Voir l'annonce</a>
                </div>
              </div>
            </div>
          @endforeach
        </div>

        <div style="margin-top: 2rem;">
          {{ $venues->links() }}
        </div>
      @endif
    </div>

  </div>

</div>
@endsection
