@extends('layouts.app')

@section('title', 'Mes Réservations - Celebra Cameroon')

@section('content')
<div class="container">

  <div style="margin-bottom: 2rem;">
    <h1 class="section-title"><i class="fa-solid fa-calendar-check" style="color:var(--primary);"></i> Suivi des Réservations</h1>
    <p class="section-subtitle">Gérez vos demandes de réservation envoyées et reçues en tant qu'hôte.</p>
  </div>

  <!-- Tabs Header -->
  <div style="display: flex; gap: 1rem; border-bottom: 1px solid var(--glass-border); margin-bottom: 2rem;">
    <button onclick="switchTab('my-bookings')" id="tab-btn-my" class="btn btn-ghost" style="border-bottom: 3px solid var(--primary); border-radius:0; color:var(--primary); font-weight:700;">
      <i class="fa-solid fa-user-check"></i> Mes Réservations Effectuées ({{ $myBookings->count() }})
    </button>
    <button onclick="switchTab('received-bookings')" id="tab-btn-received" class="btn btn-ghost" style="border-bottom: 3px solid transparent; border-radius:0; color:var(--text-muted); font-weight:700;">
      <i class="fa-solid fa-inbox"></i> Demandes Reçues sur mes Lieux ({{ $receivedBookings->count() }})
    </button>
  </div>

  <!-- Tab 1: My Bookings -->
  <div id="tab-my-bookings">
    @if($myBookings->isEmpty())
      <div style="background: var(--bg-card); padding: 3rem; border-radius: var(--radius-lg); text-align: center; border: 1px solid var(--glass-border);">
        <i class="fa-solid fa-calendar-xmark" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <h3>Vous n'avez aucune réservation enregistrée</h3>
        <p style="color: var(--text-muted); margin-top: 0.5rem;">Explorez nos salles d'exception à Douala, Yaoundé ou Kribi pour effectuer votre première réservation.</p>
        <a href="{{ route('venues.index') }}" class="btn btn-primary" style="margin-top: 1.5rem;">Explorer le catalogue</a>
      </div>
    @else
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        @foreach($myBookings as $booking)
          <div style="background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--glass-border); padding: 1.5rem; display: grid; grid-template-columns: 140px 1fr auto; gap: 1.5rem; align-items: center;">
            <img src="{{ $booking->venue->main_image ?? 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&q=80' }}" alt="{{ $booking->venue->title }}" style="width: 140px; height: 100px; border-radius: var(--radius-md); object-fit: cover;">

            <div>
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.35rem;">
                <span class="logo-badge" style="background:var(--primary-light); color:var(--primary); font-size:0.75rem;">#RES-{{ $booking->id }}</span>
                <h3 style="font-size: 1.15rem; font-weight: 700;">{{ $booking->venue->title }}</h3>
              </div>

              <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; gap: 1.5rem; margin-bottom: 0.5rem;">
                <span><i class="fa-solid fa-location-dot"></i> {{ $booking->venue->city }} ({{ $booking->venue->district }})</span>
                <span><i class="fa-solid fa-calendar"></i> Du {{ $booking->start_date->format('d/m/Y') }} au {{ $booking->end_date->format('d/m/Y') }}</span>
                <span><i class="fa-solid fa-people-group"></i> {{ $booking->guest_count }} personnes</span>
              </div>

              <div style="font-size: 0.85rem; color: var(--text-main);">
                <strong>Événement:</strong> {{ $booking->event_type }}
              </div>
            </div>

            <div style="text-align: right; display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end;">
              <div style="font-size: 1.3rem; font-weight: 800; color: var(--accent);">
                {{ number_format($booking->total_price, 0, ',', ' ') }} FCFA
              </div>

              <div>
                @if($booking->status === 'confirmed')
                  <span style="background: #dcfce7; color: #15803d; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.8rem;"><i class="fa-solid fa-circle-check"></i> Confirmée</span>
                @elseif($booking->status === 'pending')
                  <span style="background: #fef3c7; color: #b45309; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.8rem;"><i class="fa-solid fa-clock"></i> En attente</span>
                @elseif($booking->status === 'cancelled')
                  <span style="background: #fee2e2; color: #b91c1c; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.8rem;"><i class="fa-solid fa-circle-xmark"></i> Annulée</span>
                @else
                  <span style="background: #e0e7ff; color: #4338ca; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.8rem;"><i class="fa-solid fa-flag-checkered"></i> {{ ucfirst($booking->status) }}</span>
                @endif
              </div>

              <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                <a href="{{ route('messages.index', ['contact' => $booking->venue->user_id, 'venue_id' => $booking->venue_id]) }}" class="btn btn-outline btn-sm">
                  <i class="fa-solid fa-comments"></i> Hôte
                </a>
              </div>
            </div>
          </div>
        @endforeach
      </div>
    @endif
  </div>

  <!-- Tab 2: Received Bookings -->
  <div id="tab-received-bookings" style="display: none;">
    @if($receivedBookings->isEmpty())
      <div style="background: var(--bg-card); padding: 3rem; border-radius: var(--radius-lg); text-align: center; border: 1px solid var(--glass-border);">
        <i class="fa-solid fa-inbox" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <h3>Aucune demande de réservation reçue</h3>
        <p style="color: var(--text-muted); margin-top: 0.5rem;">Publiez de nouveaux lieux ou ajustez vos tarifs pour recevoir des demandes.</p>
      </div>
    @else
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        @foreach($receivedBookings as $booking)
          <div style="background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--glass-border); padding: 1.5rem; display: grid; grid-template-columns: 1fr auto; gap: 1.5rem; align-items: center;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.35rem;">
                <span class="logo-badge" style="background:var(--accent-light); color:var(--accent); font-size:0.75rem;">#RES-{{ $booking->id }}</span>
                <h3 style="font-size: 1.15rem; font-weight: 700;">Demande de {{ $booking->user->name }} ({{ $booking->user->email }})</h3>
              </div>

              <div style="font-size: 0.9rem; color: var(--primary); font-weight: 700; margin-bottom: 0.35rem;">
                Lieu: {{ $booking->venue->title }} ({{ $booking->venue->city }})
              </div>

              <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; gap: 1.5rem; margin-bottom: 0.5rem;">
                <span><i class="fa-solid fa-calendar"></i> Du {{ $booking->start_date->format('d/m/Y') }} au {{ $booking->end_date->format('d/m/Y') }}</span>
                <span><i class="fa-solid fa-users"></i> {{ $booking->guest_count }} invités</span>
                <span><i class="fa-solid fa-champagne-glasses"></i> {{ $booking->event_type }}</span>
              </div>

              @if($booking->special_requests)
                <div style="font-size: 0.85rem; background: var(--bg-main); padding: 0.5rem 0.85rem; border-radius: 6px; margin-top: 0.35rem;">
                  <strong>Remarque client:</strong> "{{ $booking->special_requests }}"
                </div>
              @endif
            </div>

            <div style="text-align: right; display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-end;">
              <div style="font-size: 1.3rem; font-weight: 800; color: var(--accent);">
                {{ number_format($booking->total_price, 0, ',', ' ') }} FCFA
              </div>

              <form action="{{ route('bookings.updateStatus', $booking->id) }}" method="POST" style="display: flex; gap: 0.5rem;">
                @csrf
                @method('PATCH')
                @if($booking->status === 'pending')
                  <button type="submit" name="status" value="confirmed" class="btn btn-primary btn-sm"><i class="fa-solid fa-check"></i> Accepter</button>
                  <button type="submit" name="status" value="cancelled" class="btn btn-ghost btn-sm" style="color:#ef4444;"><i class="fa-solid fa-xmark"></i> Refuser</button>
                @else
                  <span style="font-size:0.85rem; font-weight:700; color:var(--text-muted);">Statut actuel: {{ ucfirst($booking->status) }}</span>
                @endif
              </form>
            </div>
          </div>
        @endforeach
      </div>
    @endif
  </div>

</div>

@section('scripts')
<script>
  function switchTab(tabName) {
    const myTab = document.getElementById('tab-my-bookings');
    const receivedTab = document.getElementById('tab-received-bookings');
    const btnMy = document.getElementById('tab-btn-my');
    const btnReceived = document.getElementById('tab-btn-received');

    if (tabName === 'my-bookings') {
      myTab.style.display = 'block';
      receivedTab.style.display = 'none';
      btnMy.style.borderBottomColor = 'var(--primary)';
      btnMy.style.color = 'var(--primary)';
      btnReceived.style.borderBottomColor = 'transparent';
      btnReceived.style.color = 'var(--text-muted)';
    } else {
      myTab.style.display = 'none';
      receivedTab.style.display = 'block';
      btnReceived.style.borderBottomColor = 'var(--primary)';
      btnReceived.style.color = 'var(--primary)';
      btnMy.style.borderBottomColor = 'transparent';
      btnMy.style.color = 'var(--text-muted)';
    }
  }
</script>
@endsection
@endsection
