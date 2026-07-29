@extends('layouts.app')

@section('title', 'Modifier ' . $venue->title . ' - Celebra Cameroon')

@section('content')
<div class="container" style="max-width: 850px;">

  <div style="margin-bottom: 2rem;">
    <h1 class="section-title"><i class="fa-solid fa-pen-to-square" style="color:var(--primary);"></i> Modifier l'Annonce</h1>
    <p class="section-subtitle">Mettez à jour les informations, tarifs ou équipements de votre espace.</p>
  </div>

  <div style="background: var(--bg-card); padding: 2.5rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); box-shadow: var(--shadow-subtle);">
    
    <form action="{{ route('venues.update', $venue->id) }}" method="POST" style="display: flex; flex-direction: column; gap: 1.5rem;">
      @csrf
      @method('PUT')

      <div class="form-group">
        <label class="form-label">Titre de l'espace *</label>
        <input type="text" name="title" class="form-control" required value="{{ old('title', $venue->title) }}">
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
        <div class="form-group">
          <label class="form-label">Catégorie *</label>
          <select name="category" class="form-control" required>
            @foreach($categories as $cat)
              <option value="{{ $cat }}" {{ $venue->category == $cat ? 'selected' : '' }}>{{ $cat }}</option>
            @endforeach
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Ville *</label>
          <select name="city" class="form-control" required>
            @foreach($cities as $c)
              <option value="{{ $c }}" {{ $venue->city == $c ? 'selected' : '' }}>{{ $c }}</option>
            @endforeach
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem;">
        <div class="form-group">
          <label class="form-label">Quartier *</label>
          <input type="text" name="district" class="form-control" required value="{{ old('district', $venue->district) }}">
        </div>

        <div class="form-group">
          <label class="form-label">Adresse *</label>
          <input type="text" name="address" class="form-control" required value="{{ old('address', $venue->address) }}">
        </div>

        <div class="form-group">
          <label class="form-label">Statut *</label>
          <select name="status" class="form-control" required>
            <option value="active" {{ $venue->status == 'active' ? 'selected' : '' }}>Actif (En location)</option>
            <option value="maintenance" {{ $venue->status == 'maintenance' ? 'selected' : '' }}>En maintenance</option>
            <option value="booked" {{ $venue->status == 'booked' ? 'selected' : '' }}>Réservé</option>
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem;">
        <div class="form-group">
          <label class="form-label">Capacité (Invités) *</label>
          <input type="number" name="capacity" class="form-control" required value="{{ old('capacity', $venue->capacity) }}">
        </div>

        <div class="form-group">
          <label class="form-label">Tarif par jour (FCFA) *</label>
          <input type="number" name="price_per_day" class="form-control" required value="{{ old('price_per_day', $venue->price_per_day) }}">
        </div>

        <div class="form-group">
          <label class="form-label">Tarif par heure (FCFA)</label>
          <input type="number" name="price_per_hour" class="form-control" value="{{ old('price_per_hour', $venue->price_per_hour) }}">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Description *</label>
        <textarea name="description" class="form-control" rows="5" required>{{ old('description', $venue->description) }}</textarea>
      </div>

      <div class="form-group">
        <label class="form-label">URL Image principale *</label>
        <input type="url" name="main_image" class="form-control" required value="{{ old('main_image', $venue->main_image) }}">
      </div>

      <div class="form-group">
        <label class="form-label">Galerie Photos (URLs séparées par virgule)</label>
        <textarea name="gallery" class="form-control" rows="2">{{ old('gallery', is_array($venue->gallery_images) ? implode(', ', $venue->gallery_images) : '') }}</textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Équipements</label>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem; margin-top: 0.5rem;">
          @foreach($availableAmenities as $amenity)
            <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer;">
              <input type="checkbox" name="amenities[]" value="{{ $amenity }}" {{ is_array($venue->amenities) && in_array($amenity, $venue->amenities) ? 'checked' : '' }}>
              <span>{{ $amenity }}</span>
            </label>
          @endforeach
        </div>
      </div>

      <div style="display: flex; gap: 1rem; margin-top: 1rem;">
        <button type="submit" class="btn btn-primary" style="flex:1; padding: 0.85rem;">
          <i class="fa-solid fa-floppy-disk"></i> Enregistrer les modifications
        </button>
        <a href="{{ route('venues.show', $venue->id) }}" class="btn btn-ghost">Annuler</a>
      </div>

    </form>
  </div>

</div>
@endsection
