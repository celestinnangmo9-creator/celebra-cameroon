@extends('layouts.app')

@section('title', 'Créer un Compte - Celebra Cameroon')

@section('content')
<div class="container" style="max-width: 520px; margin-top: 2rem; margin-bottom: 3rem;">

  <div style="background: var(--bg-card); padding: 2.5rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); box-shadow: var(--shadow-hover);">
    <div style="text-align: center; margin-bottom: 2rem;">
      <img src="{{ asset('images/logo.png') }}" alt="Celebra Cameroon" class="logo-img" style="margin-bottom: 0.5rem; display: block; margin: 0 auto 1rem;">
      <h1 style="font-size: 1.8rem; font-weight: 800;">Inscription Gratuite</h1>
      <p style="color: var(--text-muted); font-size: 0.9rem;">Rejoignez la plateforme événementielle N°1 au Cameroun</p>
    </div>

    <form action="{{ route('register') }}" method="POST" style="display: flex; flex-direction: column; gap: 1.2rem;">
      @csrf

      <div class="form-group">
        <label class="form-label">Nom complet *</label>
        <input type="text" name="name" class="form-control" placeholder="Ex: Samuel Etoo" required value="{{ old('name') }}">
      </div>

      <div class="form-group">
        <label class="form-label">Adresse Email *</label>
        <input type="email" name="email" class="form-control" placeholder="votre.email@exemple.cm" required value="{{ old('email') }}">
      </div>

      <div class="form-group">
        <label class="form-label">Téléphone (WhatsApp) *</label>
        <input type="text" name="phone" class="form-control" placeholder="+237 6XX XX XX XX" value="{{ old('phone') }}">
      </div>

      <div class="form-group">
        <label class="form-label">Je souhaite *</label>
        <select name="role" class="form-control" required>
          <option value="client">Réserver des salles (Client / Organisateur)</option>
          <option value="host">Publier et louer mes espaces (Hôte / Propriétaire)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Mot de passe *</label>
        <input type="password" name="password" class="form-control" placeholder="••••••••" required>
      </div>

      <div class="form-group">
        <label class="form-label">Confirmer le mot de passe *</label>
        <input type="password" name="password_confirmation" class="form-control" placeholder="••••••••" required>
      </div>

      <button type="submit" class="btn btn-primary" style="padding: 0.85rem; font-size: 1rem; width: 100%; margin-top:0.5rem;">
        Créer mon compte
      </button>
    </form>

    <div style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted);">
      Déjà inscrit ? <a href="{{ route('login') }}" style="color: var(--primary); font-weight: 700;">Se connecter</a>
    </div>
  </div>

</div>
@endsection
