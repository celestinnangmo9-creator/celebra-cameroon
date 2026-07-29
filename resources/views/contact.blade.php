@extends('layouts.app')

@section('title', 'Contactez-nous - Celebra Cameroon')

@section('content')
<div class="container" style="max-width: 900px; margin-top: 2rem; margin-bottom: 4rem;">

  <div style="text-align: center; margin-bottom: 3rem;">
    <h1 class="section-title">Contactez l'Équipe Celebra</h1>
    <p class="section-subtitle">Notre équipe basée à Douala et Yaoundé est à votre écoute 7j/7.</p>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
    
    <div style="background: var(--bg-card); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border);">
      <h3 style="margin-bottom: 1.5rem; font-weight: 800;">Nos Coordonnées</h3>

      <div style="display: flex; flex-direction: column; gap: 1.2rem;">
        <div>
          <div style="font-weight: 700; color: var(--primary);"><i class="fa-solid fa-location-dot"></i> Siège Douala</div>
          <div style="color: var(--text-muted); font-size: 0.9rem;">Boulevard de la Liberté, Akwa, Douala - Cameroun</div>
        </div>

        <div>
          <div style="font-weight: 700; color: var(--primary);"><i class="fa-solid fa-phone"></i> Téléphone / WhatsApp</div>
          <div style="color: var(--text-muted); font-size: 0.9rem;">+237 696675924</div>
        </div>

        <div>
          <div style="font-weight: 700; color: var(--primary);"><i class="fa-solid fa-envelope"></i> Email</div>
          <div style="color: var(--text-muted); font-size: 0.9rem;">celestinnangmo9@gmail.com</div>
        </div>
      </div>
    </div>

    <div style="background: var(--bg-card); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border);">
      <h3 style="margin-bottom: 1.5rem; font-weight: 800;">Envoyez un Message</h3>

      <form onsubmit="alert('Merci pour votre message ! Notre équipe vous recontactera sous 2h.'); return false;" style="display: flex; flex-direction: column; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Nom complet</label>
          <input type="text" class="form-control" required placeholder="Votre nom">
        </div>

        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" required placeholder="nom@exemple.cm">
        </div>

        <div class="form-group">
          <label class="form-label">Message</label>
          <textarea class="form-control" rows="4" required placeholder="Comment pouvons-nous vous aider ?"></textarea>
        </div>

        <button type="submit" class="btn btn-primary">Envoyer le message</button>
      </form>
    </div>

  </div>

</div>
@endsection
