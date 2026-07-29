@extends('layouts.app')

@section('title', 'Tableau de Bord Hôte - Celebra Cameroon')

@section('content')
<div class="container">

  <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
    <div>
      <h1 class="section-title"><i class="fa-solid fa-chart-line" style="color:var(--primary);"></i> Tableau de Bord Hôte</h1>
      <p class="section-subtitle">Aperçu global de vos annonces et de vos revenus d'espaces au Cameroun.</p>
    </div>

    <div>
      <a href="{{ route('venues.create') }}" class="btn btn-accent"><i class="fa-solid fa-plus"></i> Ajouter une nouvelle salle</a>
    </div>
  </div>

  <!-- KPI Cards -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
    <!-- Revenue -->
    <div style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 1.2rem;">
      <div style="width: 56px; height: 56px; border-radius: 14px; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
        <i class="fa-solid fa-wallet"></i>
      </div>
      <div>
        <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; uppercase;">Revenu Total Validé</div>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent);">{{ number_format($totalRevenue, 0, ',', ' ') }} FCFA</div>
      </div>
    </div>

    <!-- Active Venues -->
    <div style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 1.2rem;">
      <div style="width: 56px; height: 56px; border-radius: 14px; background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
        <i class="fa-solid fa-building"></i>
      </div>
      <div>
        <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; uppercase;">Mes Espaces</div>
        <div style="font-size: 1.5rem; font-weight: 800;">{{ $totalVenues }}</div>
      </div>
    </div>

    <!-- Total Bookings -->
    <div style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 1.2rem;">
      <div style="width: 56px; height: 56px; border-radius: 14px; background: #e0e7ff; color: #4338ca; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
        <i class="fa-solid fa-calendar-check"></i>
      </div>
      <div>
        <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; uppercase;">Réservations Totales</div>
        <div style="font-size: 1.5rem; font-weight: 800;">{{ $totalBookings }}</div>
      </div>
    </div>

    <!-- Pending Requests -->
    <div style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 1.2rem;">
      <div style="width: 56px; height: 56px; border-radius: 14px; background: #ffe4e6; color: #e11d48; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
        <i class="fa-solid fa-bell"></i>
      </div>
      <div>
        <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; uppercase;">Demandes en attente</div>
        <div style="font-size: 1.5rem; font-weight: 800; color: #e11d48;">{{ $pendingBookingsCount }}</div>
      </div>
    </div>
  </div>

  <!-- Recent Bookings Table -->
  <div style="background: var(--bg-card); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); margin-bottom: 2.5rem;">
    <h2 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 1.2rem;"><i class="fa-solid fa-clock-rotate-left"></i> Dernières Demandes de Réservation Reçues</h2>

    @if($recentBookings->isEmpty())
      <p style="color: var(--text-muted);">Aucune réservation récente pour l'instant.</p>
    @else
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
          <thead>
            <tr style="border-bottom: 1px solid var(--glass-border); color: var(--text-muted); font-weight: 700;">
              <th style="padding: 0.75rem;">Client</th>
              <th style="padding: 0.75rem;">Espace</th>
              <th style="padding: 0.75rem;">Dates</th>
              <th style="padding: 0.75rem;">Montant</th>
              <th style="padding: 0.75rem;">Statut</th>
              <th style="padding: 0.75rem;">Action</th>
            </tr>
          </thead>
          <tbody>
            @foreach($recentBookings as $b)
              <tr style="border-bottom: 1px solid var(--glass-border);">
                <td style="padding: 0.85rem; font-weight: 600;">{{ $b->user->name }}</td>
                <td style="padding: 0.85rem;">{{ $b->venue->title }} ({{ $b->venue->city }})</td>
                <td style="padding: 0.85rem;">{{ $b->start_date->format('d/m/Y') }} - {{ $b->end_date->format('d/m/Y') }}</td>
                <td style="padding: 0.85rem; font-weight: 700; color: var(--accent);">{{ number_format($b->total_price, 0, ',', ' ') }} FCFA</td>
                <td style="padding: 0.85rem;">
                  <span style="background: {{ $b->status === 'confirmed' ? '#dcfce7' : ($b->status === 'pending' ? '#fef3c7' : '#fee2e2') }}; color: {{ $b->status === 'confirmed' ? '#15803d' : ($b->status === 'pending' ? '#b45309' : '#b91c1c') }}; padding: 3px 10px; border-radius: 12px; font-weight: 700; font-size: 0.75rem;">
                    {{ ucfirst($b->status) }}
                  </span>
                </td>
                <td style="padding: 0.85rem;">
                  <a href="{{ route('bookings.index') }}" class="btn btn-outline btn-sm">Gérer</a>
                </td>
              </tr>
            @endforeach
          </tbody>
        </table>
      </div>
    @endif
  </div>

  <!-- Upcoming Appointments / Visits -->
  <div style="background: var(--bg-card); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--glass-border);">
    <h2 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 1.2rem;"><i class="fa-solid fa-calendar-days"></i> Rendez-vous de Visites Planifiées</h2>
    
    @if($upcomingAppointments->isEmpty())
      <p style="color: var(--text-muted);">Aucune visite planifiée dans les prochains jours.</p>
    @else
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        @foreach($upcomingAppointments as $app)
          <div style="background: var(--bg-main); padding: 1rem 1.5rem; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between;">
            <div>
              <strong>{{ $app->user->name }}</strong> souhaite visiter <strong>{{ $app->venue->title }}</strong>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
                <i class="fa-regular fa-clock"></i> {{ $app->scheduled_at->format('d/m/Y à H:i') }} ({{ $app->type === 'physical_visit' ? 'Visite Physique' : 'Visite par Appel Vidéo' }})
              </div>
            </div>
            <a href="{{ route('messages.index', ['contact' => $app->user_id]) }}" class="btn btn-primary btn-sm"><i class="fa-solid fa-comments"></i> Discuter</a>
          </div>
        @endforeach
      </div>
    @endif
  </div>

</div>
@endsection
