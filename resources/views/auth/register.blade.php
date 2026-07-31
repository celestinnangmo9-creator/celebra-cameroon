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
        @error('name')
          <span style="color:#ef4444; font-size:0.8rem; margin-top:0.25rem;">{{ $message }}</span>
        @enderror
      </div>

      <div class="form-group">
        <label class="form-label">Adresse Email *</label>
        <input type="email" name="email" class="form-control" placeholder="votre.email@exemple.cm" required value="{{ old('email') }}">
        @error('email')
          <span style="color:#ef4444; font-size:0.8rem; margin-top:0.25rem;">{{ $message }}</span>
        @enderror
      </div>

      <div class="form-group">
        <label class="form-label">Téléphone (WhatsApp) *</label>
        <input type="text" name="phone" class="form-control" placeholder="+237 6XX XX XX XX" value="{{ old('phone') }}">
      </div>

      <div class="form-group">
        <label class="form-label">Je souhaite *</label>
        <select name="role" class="form-control" required>
          <option value="client" {{ old('role') == 'client' ? 'selected' : '' }}>Réserver des salles (Client / Organisateur)</option>
          <option value="host" {{ old('role') == 'host' ? 'selected' : '' }}>Publier et louer mes espaces (Hôte / Propriétaire)</option>
        </select>
        @error('role')
          <span style="color:#ef4444; font-size:0.8rem; margin-top:0.25rem;">{{ $message }}</span>
        @enderror
      </div>

      <div class="form-group">
        <label class="form-label">Mot de passe *</label>
        <div style="position: relative;">
          <input type="password" name="password" id="reg-password" class="form-control" placeholder="••••••••" required style="padding-right: 40px;">
          <button type="button" onclick="togglePassword('reg-password', this)" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-muted);">
            <i class="fa-regular fa-eye"></i>
          </button>
        </div>
        @error('password')
          <span style="color:#ef4444; font-size:0.8rem; margin-top:0.25rem;">{{ $message }}</span>
        @enderror
      </div>

      <div class="form-group">
        <label class="form-label">Confirmer le mot de passe *</label>
        <div style="position: relative;">
          <input type="password" name="password_confirmation" id="reg-password-confirm" class="form-control" placeholder="••••••••" required style="padding-right: 40px;">
          <button type="button" onclick="togglePassword('reg-password-confirm', this)" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-muted);">
            <i class="fa-regular fa-eye"></i>
          </button>
        </div>
        @error('password_confirmation')
          <span style="color:#ef4444; font-size:0.8rem; margin-top:0.25rem;">{{ $message }}</span>
        @enderror
      </div>

      <button type="submit" class="btn btn-primary" style="padding: 0.85rem; font-size: 1rem; width: 100%; margin-top:0.5rem;">
        Créer mon compte
      </button>
    </form>

    <div style="display: flex; align-items: center; text-align: center; color: var(--text-muted); font-size: 0.85rem; margin: 1.5rem 0;">
      <div style="flex-grow: 1; height: 1px; background: #e5e7eb;"></div>
      <span style="padding: 0 1rem;">ou</span>
      <div style="flex-grow: 1; height: 1px; background: #e5e7eb;"></div>
    </div>

    <!-- Google Login Button -->
    <a href="{{ route('google.redirect') }}" class="btn" style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; width: 100%; background: #ffffff; color: #374151; border: 1px solid #e5e7eb; padding: 0.85rem; font-size: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); text-decoration: none;">
      <svg class="w-5 h-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        <path d="M1 1h22v22H1z" fill="none"/>
      </svg>
      <strong>Continuer avec Google</strong>
    </a>

    <div style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted);">
      Déjà inscrit ? <a href="{{ route('login') }}" style="color: var(--primary); font-weight: 700;">Se connecter</a>
    </div>
  </div>

</div>

@section('scripts')
<script>
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon = btn.querySelector('i');
  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = "password";
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}
</script>
@endsection
@endsection
