<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>@yield('title', 'Celebra Cameroon - Salles de fête & Lieux événementiels au Cameroun')</title>
  <meta name="description" content="Réservez ou publiez des salles de fête, espaces verts, bureaux et terrasses VIP à Douala, Yaoundé, Kribi et partout au Cameroun.">
  
  <!-- Google Fonts & FontAwesome -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <!-- Custom Design System CSS -->
  <link rel="stylesheet" href="{{ asset('css/app.css') }}?v={{ time() }}">
  @yield('styles')
</head>
<body>

  <!-- Header & Navigation -->
  <header class="header">
    <div class="nav-container">
      <a href="{{ route('home') }}" class="logo" style="padding: 0.25rem 0;">
        <img src="{{ asset('images/logo.png') }}" alt="Celebra Cameroon" class="logo-img">
      </a>

      <button id="mobile-menu-btn" class="btn btn-ghost" style="display: none; font-size: 1.5rem;">
        <i class="fa-solid fa-bars"></i>
      </button>

      <ul class="nav-links" id="nav-links">
        <li><a href="{{ route('home') }}" class="nav-link {{ request()->routeIs('home') ? 'active' : '' }}"><i class="fa-solid fa-house"></i> Accueil</a></li>
        <li><a href="{{ route('venues.index') }}" class="nav-link {{ request()->routeIs('venues.*') && !request()->routeIs('venues.create') ? 'active' : '' }}"><i class="fa-solid fa-building"></i> Lieux & Salles</a></li>
        <li><a href="{{ route('messages.index') }}" class="nav-link {{ request()->routeIs('messages.*') ? 'active' : '' }}"><i class="fa-solid fa-comments"></i> Messagerie</a></li>
        <li><a href="{{ route('bookings.index') }}" class="nav-link {{ request()->routeIs('bookings.*') ? 'active' : '' }}"><i class="fa-solid fa-calendar-check"></i> Réservations</a></li>
        <li><a href="{{ route('about') }}" class="nav-link {{ request()->routeIs('about') ? 'active' : '' }}">À Propos</a></li>
      </ul>

      <div class="nav-actions">
        <button id="theme-toggle-btn" class="btn btn-ghost" title="Basculer le mode sombre/clair">
          <i class="fa-solid fa-moon"></i>
        </button>

        @auth
          <a href="{{ route('venues.create') }}" class="btn btn-accent"><i class="fa-solid fa-plus"></i> Publier un lieu</a>
          <a href="{{ route('dashboard') }}" class="btn btn-outline" title="Tableau de bord"><i class="fa-solid fa-chart-line"></i> Dashboard</a>
          <form action="{{ route('logout') }}" method="POST" style="display:inline;">
            @csrf
            <button type="submit" class="btn btn-ghost" title="Déconnexion"><i class="fa-solid fa-right-from-bracket"></i></button>
          </form>
        @else
          <a href="{{ route('login') }}" class="btn btn-ghost"><i class="fa-solid fa-user"></i> Connexion</a>
          <a href="{{ route('register') }}" class="btn btn-primary">Inscription</a>
          <a href="{{ route('venues.create') }}" class="btn btn-accent"><i class="fa-solid fa-plus"></i> Publier un lieu</a>
        @endauth
      </div>
    </div>
  </header>

  <!-- Flash Alerts -->
  @if (session('success'))
    <div style="max-width: 1280px; margin: 1rem auto; padding: 1rem 1.5rem; background: #dcfce7; color: #166534; border-radius: 12px; font-weight: 600; display: flex; align-items: center; justify-content: space-between;">
      <span><i class="fa-solid fa-circle-check"></i> {{ session('success') }}</span>
      <button onclick="this.parentElement.remove();" style="background:none; border:none; color:inherit; cursor:pointer; font-size:1.2rem;">&times;</button>
    </div>
  @endif

  @if (session('error'))
    <div style="max-width: 1280px; margin: 1rem auto; padding: 1rem 1.5rem; background: #fee2e2; color: #991b1b; border-radius: 12px; font-weight: 600; display: flex; align-items: center; justify-content: space-between;">
      <span><i class="fa-solid fa-circle-xmark"></i> {{ session('error') }}</span>
      <button onclick="this.parentElement.remove();" style="background:none; border:none; color:inherit; cursor:pointer; font-size:1.2rem;">&times;</button>
    </div>
  @endif

  <!-- Main Content -->
  <main style="flex-grow: 1;">
    @yield('content')
  </main>

  <!-- Call Simulation Modal -->
  <div id="call-modal-overlay" class="modal-overlay">
    <div class="call-modal">
      <div id="call-modal-title" style="font-size: 1.4rem; font-weight: 800;">Appel en cours...</div>
      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" alt="Hôte" class="call-avatar">
      <div id="call-modal-status" style="color: #94a3b8; font-size: 1.1rem; margin-top: 0.5rem;">Connexion au réseau local Celebra...</div>

      <div class="call-controls">
        <button class="call-btn call-btn-ghost" style="background: #334155; color:#fff;" title="Couper le micro"><i class="fa-solid fa-microphone-slash"></i></button>
        <button class="call-btn call-btn-ghost" style="background: #334155; color:#fff;" title="Changer de caméra"><i class="fa-solid fa-video"></i></button>
        <button id="end-call-btn" class="call-btn call-btn-danger" title="Raccrocher"><i class="fa-solid fa-phone-slash"></i></button>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-container">
      <div>
        <a href="{{ route('home') }}" class="logo" style="margin-bottom: 1.5rem; display:inline-block;">
          <img src="{{ asset('images/logo.png') }}" alt="Celebra Cameroon" class="footer-logo-img">
        </a>
        <p style="margin-top: 0.5rem; font-size: 0.9rem;">La plateforme événementielle référence au Cameroun. Réservez des salles de fête, espaces verts, terrasses VIP et salles de conférence en quelques clics.</p>
      </div>

      <div>
        <h4 style="color: #fff; margin-bottom: 1.2rem;">Villes Principales</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
          <li><a href="{{ route('venues.index', ['city' => 'Douala']) }}"><i class="fa-solid fa-location-dot" style="color:var(--primary);"></i> Douala (Bonapriso, Akwa, Bastos)</a></li>
          <li><a href="{{ route('venues.index', ['city' => 'Yaoundé']) }}"><i class="fa-solid fa-location-dot" style="color:var(--primary);"></i> Yaoundé (Bastos, Golf)</a></li>
          <li><a href="{{ route('venues.index', ['city' => 'Kribi']) }}"><i class="fa-solid fa-location-dot" style="color:var(--primary);"></i> Kribi (Bord de mer, Plage)</a></li>
          <li><a href="{{ route('venues.index', ['city' => 'Bafoussam']) }}"><i class="fa-solid fa-location-dot" style="color:var(--primary);"></i> Bafoussam & Ouest</a></li>
        </ul>
      </div>

      <div>
        <h4 style="color: #fff; margin-bottom: 1.2rem;">Service Client Cameroun</h4>
        <p style="font-size: 0.9rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-phone" style="color:var(--accent);"></i> +237 696675924</p>
        <p style="font-size: 0.9rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-envelope" style="color:var(--accent);"></i> celestinnangmo9@gmail.com</p>
        <p style="font-size: 0.9rem;"><i class="fa-solid fa-building" style="color:var(--accent);"></i> Akwa, Douala - Cameroun</p>
      </div>
    </div>

    <div class="footer-bottom">
      &copy; {{ date('Y') }} Celebra Cameroon. Tous droits réservés. Inspiré et conçu pour le marché camerounais.
    </div>
  </footer>

  <script src="{{ asset('js/app.js') }}"></script>
  <script>
    // Responsive Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileBtn) {
      mobileBtn.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'var(--bg-card)';
        navLinks.style.padding = '1rem';
        navLinks.style.borderBottom = '1px solid var(--glass-border)';
        navLinks.style.boxShadow = 'var(--shadow-subtle)';
        navLinks.style.zIndex = '999';
      });
    }

    // Handle window resize to reset menu
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'row';
        navLinks.style.position = 'static';
        navLinks.style.background = 'transparent';
        navLinks.style.padding = '0';
        navLinks.style.borderBottom = 'none';
        navLinks.style.boxShadow = 'none';
      } else {
        navLinks.style.display = 'none';
      }
    });
  </script>
  @yield('scripts')
</body>
</html>
