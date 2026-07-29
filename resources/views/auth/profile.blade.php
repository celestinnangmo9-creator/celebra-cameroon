@extends('layouts.app')

@section('title', 'Mon Profil - Celebra Cameroon')

@section('content')
<div class="container" style="max-width: 650px; margin-top: 2rem;">

  <div style="background: var(--bg-card); padding: 2.5rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); box-shadow: var(--shadow-subtle);">
    <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem;">
      <img src="{{ $user->avatar ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }}" alt="{{ $user->name }}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary);">
      <div>
        <h1 style="font-size: 1.5rem; font-weight: 800;">{{ $user->name }}</h1>
        <p style="color: var(--primary); font-weight: 600; font-size: 0.9rem;">Rôle: {{ ucfirst($user->role) }}</p>
      </div>
    </div>

    <form action="{{ route('profile.update') }}" method="POST" style="display: flex; flex-direction: column; gap: 1.2rem;">
      @csrf
      @method('PUT')

      <div class="form-group">
        <label class="form-label">Nom complet</label>
        <input type="text" name="name" class="form-control" value="{{ old('name', $user->name) }}" required>
      </div>

      <div class="form-group">
        <label class="form-label">Téléphone</label>
        <input type="text" name="phone" class="form-control" value="{{ old('phone', $user->phone) }}">
      </div>

      <div class="form-group">
        <label class="form-label">URL Photo d'avatar</label>
        <input type="url" name="avatar" class="form-control" value="{{ old('avatar', $user->avatar) }}">
      </div>

      <div class="form-group">
        <label class="form-label">Bio / Présentation</label>
        <textarea name="bio" class="form-control" rows="3">{{ old('bio', $user->bio) }}</textarea>
      </div>

      <button type="submit" class="btn btn-primary" style="margin-top: 1rem;">Enregistrer mon profil</button>
    </form>
  </div>

</div>
@endsection
