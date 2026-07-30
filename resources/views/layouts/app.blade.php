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
  
  <!-- AOS Animation Library -->
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
  
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
        <li><a href="{{ route('home') }}" class="nav-link {{ request()->routeIs('home') ? 'active' : '' }}">Accueil</a></li>
        <li><a href="{{ route('venues.index') }}" class="nav-link {{ request()->routeIs('venues.*') && !request()->routeIs('venues.create') ? 'active' : '' }}">Lieux & Salles</a></li>
        <li><a href="{{ route('about') }}" class="nav-link {{ request()->routeIs('about') ? 'active' : '' }}">À Propos</a></li>
      </ul>

      <div class="nav-actions">
        <a href="{{ route('venues.create') }}" class="nav-link" style="font-weight: 600;">Mettre mon espace en ligne</a>
        
        <button id="theme-toggle-btn" class="btn btn-ghost" title="Basculer le mode sombre/clair" style="border-radius: 50%; width: 40px; height: 40px; padding: 0;">
          <i class="fa-solid fa-moon"></i>
        </button>

        <div class="user-menu-dropdown">
          <button class="user-menu-btn" id="desktop-user-btn">
            <i class="fa-solid fa-bars" style="margin-left: 0.2rem; font-size: 1.1rem;"></i>
            <div class="user-menu-avatar">
              @auth
                <img src="https://ui-avatars.com/api/?name={{ urlencode(Auth::user()->name) }}&background=059669&color=fff" alt="" style="border-radius: 50%; width: 100%; height: 100%;">
              @else
                <i class="fa-solid fa-user"></i>
              @endauth
            </div>
          </button>
          <div class="user-menu-content" id="desktop-user-menu">
            @auth
              <a href="{{ route('dashboard') }}" style="font-weight: 600;">Tableau de bord</a>
              <a href="{{ route('messages.index') }}">Messagerie</a>
              <a href="{{ route('bookings.index') }}">Mes réservations</a>
              <div class="user-menu-divider"></div>
              <a href="{{ route('venues.create') }}">Publier un lieu</a>
              <div class="user-menu-divider"></div>
              <form action="{{ route('logout') }}" method="POST">
                @csrf
                <button type="submit">Déconnexion</button>
              </form>
            @else
              <a href="{{ route('login') }}" style="font-weight: 600;">Connexion</a>
              <a href="{{ route('register') }}">Inscription</a>
              <div class="user-menu-divider"></div>
              <a href="{{ route('venues.create') }}">Mettre mon espace en ligne</a>
            @endauth
          </div>
        </div>
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
        <h4 style="color: #fff; margin-bottom: 1.2rem;">Les 10 Villes Principales</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9rem;">
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
            <li><a href="{{ route('venues.index', ['city' => 'Douala']) }}"><i class="fa-solid fa-location-dot" style="color:var(--primary); width:16px;"></i> Douala</a></li>
            <li><a href="{{ route('venues.index', ['city' => 'Yaoundé']) }}"><i class="fa-solid fa-location-dot" style="color:var(--primary); width:16px;"></i> Yaoundé</a></li>
            <li><a href="{{ route('venues.index', ['city' => 'Bafoussam']) }}"><i class="fa-solid fa-location-dot" style="color:var(--primary); width:16px;"></i> Bafoussam</a></li>
            <li><a href="{{ route('venues.index', ['city' => 'Bamenda']) }}"><i class="fa-solid fa-location-dot" style="color:var(--primary); width:16px;"></i> Bamenda</a></li>
            <li><a href="{{ route('venues.index', ['city' => 'Garoua']) }}"><i class="fa-solid fa-location-dot" style="color:var(--primary); width:16px;"></i> Garoua</a></li>
          </ul>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
            <li><a href="{{ route('venues.index', ['city' => 'Maroua']) }}"><i class="fa-solid fa-location-dot" style="color:var(--primary); width:16px;"></i> Maroua</a></li>
            <li><a href="{{ route('venues.index', ['city' => 'Ngaoundéré']) }}"><i class="fa-solid fa-location-dot" style="color:var(--primary); width:16px;"></i> Ngaoundéré</a></li>
            <li><a href="{{ route('venues.index', ['city' => 'Kribi']) }}"><i class="fa-solid fa-location-dot" style="color:var(--primary); width:16px;"></i> Kribi</a></li>
            <li><a href="{{ route('venues.index', ['city' => 'Limbe']) }}"><i class="fa-solid fa-location-dot" style="color:var(--primary); width:16px;"></i> Limbe</a></li>
            <li><a href="{{ route('venues.index', ['city' => 'Buea']) }}"><i class="fa-solid fa-location-dot" style="color:var(--primary); width:16px;"></i> Buea</a></li>
          </ul>
        </div>
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

  <!-- Mobile Bottom Navigation Bar -->
  <nav class="mobile-bottom-bar">
    <a href="{{ route('home') }}" class="bottom-nav-item {{ request()->routeIs('home') ? 'active' : '' }}">
      <i class="fa-solid fa-house"></i>
      <span>Accueil</span>
    </a>
    <a href="{{ route('venues.index') }}" class="bottom-nav-item {{ request()->routeIs('venues.*') && !request()->routeIs('venues.create') ? 'active' : '' }}">
      <i class="fa-solid fa-building"></i>
      <span>Salles</span>
    </a>
    
    <div class="bottom-nav-center">
      <a href="{{ route('venues.create') }}" class="bottom-nav-fab">
        <i class="fa-solid fa-plus"></i>
      </a>
    </div>

    <a href="{{ route('messages.index') }}" class="bottom-nav-item {{ request()->routeIs('messages.*') ? 'active' : '' }}">
      <div style="position:relative;">
        <i class="fa-solid fa-comment-dots"></i>
        @auth
          <span style="position: absolute; top: -5px; right: -8px; background: #ef4444; color: white; border-radius: 50%; width: 14px; height: 14px; font-size: 0.6rem; display: flex; align-items: center; justify-content: center;">2</span>
        @endauth
      </div>
      <span>Messages</span>
    </a>
    
    @auth
      <a href="{{ route('dashboard') }}" class="bottom-nav-item">
        <i class="fa-solid fa-user"></i>
        <span>Profil</span>
      </a>
    @else
      <a href="{{ route('login') }}" class="bottom-nav-item">
        <i class="fa-solid fa-user"></i>
        <span>Connexion</span>
      </a>
    @endauth
  </nav>

  <script>
    // Responsive Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navContainer = document.querySelector('.nav-container');
    
    if (mobileBtn) {
      mobileBtn.addEventListener('click', () => {
        navContainer.classList.toggle('mobile-menu-active');
      });
    }

    // Handle window resize to reset menu
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navContainer.classList.remove('mobile-menu-active');
      }
    });
    // Desktop User Menu Dropdown Toggle
    const desktopUserBtn = document.getElementById('desktop-user-btn');
    const desktopUserMenu = document.getElementById('desktop-user-menu');
    
    if (desktopUserBtn) {
      desktopUserBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        desktopUserMenu.classList.toggle('show');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!desktopUserBtn.contains(e.target) && !desktopUserMenu.contains(e.target)) {
          desktopUserMenu.classList.remove('show');
        }
      });
    }
  </script>

  <!-- AOS Animation Initialization -->
  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
  <script>
    AOS.init({
      duration: 800, // duration of animation
      once: true, // whether animation should happen only once - while scrolling down
      offset: 50, // offset (in px) from the original trigger point
      easing: 'ease-out-cubic' // easing for the animation
    });
  </script>

  @yield('scripts')
</body>
</html>
