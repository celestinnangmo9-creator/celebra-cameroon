@extends('layouts.app')

@section('title', 'Messagerie & Rendez-vous - Celebra Cameroon')

@section('content')
<div class="container">

  <div style="margin-bottom: 1rem;">
    <h1 class="section-title"><i class="fa-solid fa-comments" style="color:var(--primary);"></i> Messagerie & Rendez-vous</h1>
    <p class="section-subtitle">Échangez en direct avec les propriétaires de salles et planifiez des visites.</p>
  </div>

  <div class="chat-container">
    
    <!-- Sidebar: Contacts list -->
    <div class="chat-sidebar">
      <div style="padding: 1rem; border-bottom: 1px solid var(--glass-border); font-weight: 700; font-size: 0.9rem; color: var(--text-muted);">
        <i class="fa-solid fa-users"></i> Contacts (Hôtes / Clients)
      </div>

      <div class="chat-thread-list">
        @foreach($contacts as $contact)
          <a href="{{ route('messages.index', ['contact' => $contact->id]) }}" class="chat-thread-item {{ $activeContact && $activeContact->id == $contact->id ? 'active' : '' }}">
            <img src="{{ $contact->avatar ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }}" alt="{{ $contact->name }}" class="user-avatar">
            <div style="flex-grow: 1; overflow: hidden;">
              <div style="font-weight: 700; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $contact->name }}</div>
              <div style="font-size: 0.75rem; color: var(--primary); font-weight: 600;">
                {{ $contact->role === 'host' ? 'Hôte / Propriétaire' : 'Client / Organisateur' }}
              </div>
            </div>
          </a>
        @endforeach
      </div>
    </div>

    <!-- Main Chat Window -->
    <div class="chat-main">
      @if($activeContact)
        <!-- Chat Header -->
        <div class="chat-header">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <img src="{{ $activeContact->avatar ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }}" alt="{{ $activeContact->name }}" class="user-avatar">
            <div>
              <div style="font-weight: 800; font-size: 1.05rem;">{{ $activeContact->name }}</div>
              <div style="font-size: 0.8rem; color: #10b981; font-weight: 600;">
                <i class="fa-solid fa-circle" style="font-size: 0.5rem; vertical-align: middle;"></i> En ligne sur Celebra
              </div>
            </div>
          </div>

          <!-- Direct Call Actions -->
          <div style="display: flex; gap: 0.5rem;">
            <button onclick="startSimulatedCall('{{ $activeContact->name }}', 'audio')" class="btn btn-ghost btn-sm" style="background:#ecfdf5; color:var(--primary);" title="Appel Audio">
              <i class="fa-solid fa-phone"></i> Audio
            </button>
            <button onclick="startSimulatedCall('{{ $activeContact->name }}', 'video')" class="btn btn-ghost btn-sm" style="background:#fef3c7; color:var(--accent);" title="Appel Vidéo">
              <i class="fa-solid fa-video"></i> Vidéo
            </button>
            <button onclick="document.getElementById('msg-visit-modal').style.display='flex'" class="btn btn-outline btn-sm">
              <i class="fa-solid fa-calendar-plus"></i> Visite
            </button>
          </div>
        </div>

        <!-- Chat Messages Box -->
        <div class="chat-messages" id="chat-messages-box">
          @if($selectedVenue)
            <div style="background: var(--primary-light); color: var(--primary); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600; text-align: center; margin-bottom: 1rem;">
              <i class="fa-solid fa-building"></i> Échange concernant l'espace: <strong>{{ $selectedVenue->title }}</strong> ({{ $selectedVenue->city }})
            </div>
          @endif

          @forelse($messages as $msg)
            <div class="message-bubble {{ $msg->sender_id == Auth::id() ? 'message-outgoing' : 'message-incoming' }}">
              <div>{{ $msg->content }}</div>
              <div style="font-size: 0.65rem; opacity: 0.8; margin-top: 0.35rem; text-align: right;">
                {{ $msg->created_at->format('H:i') }}
              </div>
            </div>
          @empty
            <div style="text-align: center; color: var(--text-muted); margin: auto;">
              <i class="fa-regular fa-paper-plane" style="font-size: 2.5rem; margin-bottom: 0.5rem;"></i>
              <p>Aucun message. Envoyez le premier message à {{ $activeContact->name }} !</p>
            </div>
          @endforelse
        </div>

        <!-- Chat Input Form -->
        <form action="{{ route('messages.store') }}" method="POST" class="chat-input-area" id="chat-form">
          @csrf
          <input type="hidden" name="receiver_id" value="{{ $activeContact->id }}">
          @if($selectedVenue)
            <input type="hidden" name="venue_id" value="{{ $selectedVenue->id }}">
          @endif

          <input type="text" name="content" id="chat-input-field" class="form-control" placeholder="Écrivez votre message à {{ $activeContact->name }}..." required autocomplete="off">
          <button type="submit" class="btn btn-primary">
            <i class="fa-solid fa-paper-plane"></i> Envoyer
          </button>
        </form>

      @else
        <div style="margin: auto; text-align: center; color: var(--text-muted);">
          <h3>Sélectionnez un contact pour démarrer la discussion</h3>
        </div>
      @endif
    </div>

  </div>

</div>

<!-- Schedule Visit Modal from Messages -->
@if($activeContact)
<div id="msg-visit-modal" class="modal-overlay">
  <div style="background: var(--bg-card); padding: 2rem; border-radius: var(--radius-lg); max-width: 500px; width: 90%;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3 style="font-weight: 800;">Planifier une Visite / Rendez-vous avec {{ $activeContact->name }}</h3>
      <button onclick="document.getElementById('msg-visit-modal').style.display='none'" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:var(--text-muted);">&times;</button>
    </div>

    <form action="{{ route('appointments.store') }}" method="POST" style="display: flex; flex-direction: column; gap: 1rem;">
      @csrf
      <div class="form-group">
        <label class="form-label">Sélectionner un espace</label>
        <select name="venue_id" class="form-control" required>
          @foreach($allVenues as $v)
            <option value="{{ $v->id }}">{{ $v->title }} - {{ $v->city }}</option>
          @endforeach
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Type de visite</label>
        <select name="type" class="form-control" required>
          <option value="physical_visit">Visite physique sur place (Douala/Yaoundé...)</option>
          <option value="video_call">Visite virtuelle par Appel Vidéo</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Date & Heure souhaitée</label>
        <input type="datetime-local" name="scheduled_at" class="form-control" required>
      </div>

      <button type="submit" class="btn btn-primary" style="margin-top: 0.5rem;">
        Confirmer le rendez-vous
      </button>
    </form>
  </div>
</div>
@endif

@section('scripts')
<script>
  // Scroll to bottom of chat
  const chatBox = document.getElementById('chat-messages-box');
  if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
</script>
@endsection
@endsection
