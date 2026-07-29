@extends('layouts.app')

@section('title', 'Connexion - Celebra Cameroon')

@section('content')
<div class="container" style="max-width: 480px; margin-top: 3rem; margin-bottom: 3rem;">

  <div style="background: var(--bg-card); padding: 2.5rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); box-shadow: var(--shadow-hover);">
    <div style="text-align: center; margin-bottom: 2rem;">
      <img src="{{ asset('images/logo.png') }}" alt="Celebra Cameroon" class="logo-img" style="margin-bottom: 0.5rem; display: block; margin: 0 auto 1rem;">
      <h1 style="font-size: 1.8rem; font-weight: 800;">Connexion</h1>
      <p style="color: var(--text-muted); font-size: 0.9rem;">Accédez à votre espace Celebra Cameroon</p>
    </div>

    <!-- Quick Demo Logins Banner -->
    <div style="background: var(--primary-light); padding: 0.85rem; border-radius: var(--radius-md); font-size: 0.825rem; color: var(--primary); margin-bottom: 1.5rem; border: 1px dashed var(--primary);">
      <strong>Comptes de démo prédéfinis :</strong><br>
      • <strong>Hôte :</strong> host@celebra.cm / password<br>
      • <strong>Client :</strong> client@celebra.cm / password
    </div>

    <form action="{{ route('login') }}" method="POST" style="display: flex; flex-direction: column; gap: 1.2rem;">
      @csrf

      <div class="form-group">
        <label class="form-label">Adresse Email</label>
        <input type="email" name="email" class="form-control" placeholder="votre.email@exemple.cm" required value="{{ old('email') }}">
        @error('email')
          <span style="color:#ef4444; font-size:0.8rem; margin-top:0.25rem;">{{ $message }}</span>
        @enderror
      </div>

      <div class="form-group">
        <label class="form-label">Mot de passe</label>
        <input type="password" name="password" class="form-control" placeholder="••••••••" required>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
        <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
          <input type="checkbox" name="remember"> Se souvenir de moi
        </label>
      </div>

      <button type="submit" class="btn btn-primary" style="padding: 0.85rem; font-size: 1rem; width: 100%;">
        Se connecter
      </button>
    </form>

    <div style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted);">
      Vous n'avez pas de compte ? <a href="{{ route('register') }}" style="color: var(--primary); font-weight: 700;">Créer un compte</a>
    </div>
  </div>

</div>
@endsection
