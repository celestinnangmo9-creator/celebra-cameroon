@extends('layouts.app')

@section('title', 'À Propos - Celebra Cameroon')

@section('content')
<div class="container" style="max-width: 900px; margin-top: 2rem; margin-bottom: 4rem;">

  <div style="text-align: center; margin-bottom: 3rem;">
    <span class="logo-badge" style="font-size:0.9rem; padding:6px 16px;">À Propos de Nous</span>
    <h1 class="hero-title" style="color:var(--text-main); -webkit-text-fill-color: initial; margin-top: 1rem;">Celebra Cameroon</h1>
    <p class="section-subtitle">La première plateforme camerounaise dédiée à la réservation et à la promotion des lieux événementiels de standing.</p>
  </div>

  <div style="background: var(--bg-card); padding: 3rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); line-height: 1.8;">
    <h2 style="color: var(--primary); margin-bottom: 1rem;">Notre Mission</h2>
    <p style="margin-bottom: 1.5rem;">
      Celebra Cameroon est née pour faciliter l'organisation des événements au Cameroun (Douala, Yaoundé, Kribi, Bafoussam, Garoua, Limbe). Nous connectons les organisateurs de mariages, banquets, concerts, séminaires et garden parties directement avec les propriétaires d'espaces vérifiés.
    </p>

    <h2 style="color: var(--primary); margin-bottom: 1rem;">Pourquoi Choisir Celebra ?</h2>
    <ul style="margin-left: 1.5rem; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.75rem;">
      <li><strong>Transparence Totale :</strong> Tarifs clairs en FCFA, devis instantané et absence de frais cachés.</li>
      <li><strong>Interactivité Avancée :</strong> Messagerie interne direct, prise de rendez-vous pour visites physiques et simulateur d'appels audio/vidéo en direct.</li>
      <li><strong>Vérification des Équipements :</strong> Présence de groupe électrogène de secours, insonorisation et parkings gardés.</li>
    </ul>

    <div style="text-align: center; margin-top: 2rem;">
      <a href="{{ route('venues.index') }}" class="btn btn-primary btn-lg">Découvrir les salles disponibles</a>
    </div>
  </div>

</div>
@endsection
