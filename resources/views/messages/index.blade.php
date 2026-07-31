@extends('layouts.app')

@section('title', 'Messagerie & Rendez-vous - Celebra Cameroon')

@section('content')
<div class="container">

  <div style="margin-bottom: 1rem;">
    <h1 class="section-title"><i class="fa-solid fa-comments" style="color:var(--primary);"></i> Messagerie & Rendez-vous</h1>
    <p class="section-subtitle">Échangez en direct avec les propriétaires de salles et planifiez des visites.</p>
  </div>

  <div class="chat-container {{ $activeContact ? 'has-active-contact' : '' }}">
    
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
            <a href="{{ route('messages.index') }}" class="mobile-back-btn" style="color: var(--text-main); font-size: 1.2rem; display: none; text-decoration: none;">
              <i class="fa-solid fa-arrow-left"></i>
            </a>
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
            <a href="{{ route('venues.show', $selectedVenue->id) }}" style="display: block; text-decoration: none; background: var(--primary-light); color: var(--primary); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600; text-align: center; margin-bottom: 1rem; transition: background 0.2s; cursor: pointer;" onmouseover="this.style.background='#d1fae5'" onmouseout="this.style.background='var(--primary-light)'">
              <i class="fa-solid fa-building"></i> Échange concernant l'espace: <strong>{{ $selectedVenue->title }}</strong> ({{ $selectedVenue->city }}) <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem; margin-left: 0.5rem;"></i>
            </a>
          @endif

          <div id="messages-container">
            @forelse($messages as $msg)
              <div class="message-bubble {{ $msg->sender_id == Auth::id() ? 'message-outgoing' : 'message-incoming' }}" data-id="{{ $msg->id }}">
                @if($msg->attachment)
                  <div class="message-attachment">
                    <img src="{{ asset('storage/' . $msg->attachment) }}" alt="Pièce jointe" style="max-width: 200px; border-radius: 8px; margin-bottom: 0.5rem; cursor: pointer;" onclick="window.open(this.src, '_blank')">
                  </div>
                @endif
                @if($msg->content)
                  <div>{{ $msg->content }}</div>
                @endif
                <div style="font-size: 0.65rem; opacity: 0.8; margin-top: 0.35rem; text-align: right;">
                  {{ $msg->created_at->format('H:i') }}
                  @if($msg->sender_id == Auth::id())
                    <i class="fa-solid fa-check{{ $msg->is_read ? '-double' : '' }}" style="margin-left: 3px; color: {{ $msg->is_read ? '#3b82f6' : 'inherit' }}"></i>
                  @endif
                </div>
              </div>
            @empty
              <div id="no-messages-placeholder" style="text-align: center; color: var(--text-muted); margin: auto;">
                <i class="fa-regular fa-paper-plane" style="font-size: 2.5rem; margin-bottom: 0.5rem;"></i>
                <p>Aucun message. Envoyez le premier message à {{ $activeContact->name }} !</p>
              </div>
            @endforelse
          </div>
        </div>

        <!-- Chat Input Form -->
        <div style="padding: 1rem; background: var(--bg-card); border-top: 1px solid var(--glass-border);">
          <div id="attachment-preview" style="display: none; margin-bottom: 1rem; position: relative;">
            <img id="preview-img" src="" style="max-height: 100px; border-radius: 8px;">
            <button type="button" onclick="clearAttachment()" style="position: absolute; top: -10px; left: 80px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer;">&times;</button>
          </div>
          
          <form action="{{ route('messages.store', [], false) }}" method="POST" enctype="multipart/form-data" class="chat-input-area" id="chat-form" style="display: flex; gap: 0.5rem; align-items: center; padding: 0; background: transparent; border: none;">
            @csrf
            <input type="hidden" name="receiver_id" value="{{ $activeContact->id }}">
            @if($selectedVenue)
              <input type="hidden" name="venue_id" value="{{ $selectedVenue->id }}">
            @endif

            <label class="btn btn-ghost" style="padding: 0.5rem 0.75rem; cursor: pointer; color: var(--text-muted);" title="Joindre une image">
              <i class="fa-solid fa-paperclip"></i>
              <input type="file" name="attachment" id="attachment-input" style="display: none;" accept="image/*" onchange="previewAttachment(this)">
            </label>

            <input type="text" name="content" id="chat-input-field" class="form-control" placeholder="Écrivez votre message à {{ $activeContact->name }}..." autocomplete="off" style="flex-grow: 1;">
            
            <button type="submit" class="btn btn-primary" id="chat-submit-btn">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>

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
  const currentUserId = {{ Auth::id() ?? 1 }};
  const activeContactId = {{ $activeContact ? $activeContact->id : 'null' }};
  const fetchUrl = activeContactId ? `/messages/fetch/${activeContactId}` : null;
  const markReadUrl = activeContactId ? `/messages/mark-as-read/${activeContactId}` : null;
  const csrfTokenElement = document.querySelector('input[name="_token"]');
  const csrfToken = csrfTokenElement ? csrfTokenElement.value : '{{ csrf_token() }}';

  const chatBox = document.getElementById('chat-messages-box');
  const messagesContainer = document.getElementById('messages-container');
  let lastMessageId = {{ isset($messages) && $messages->count() > 0 ? $messages->last()->id : 0 }};

  if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Preview attachment
  function previewAttachment(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('preview-img').src = e.target.result;
        document.getElementById('attachment-preview').style.display = 'inline-block';
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  function clearAttachment() {
    document.getElementById('attachment-input').value = "";
    document.getElementById('attachment-preview').style.display = 'none';
  }

  // Handle Form Submit via AJAX
  const chatForm = document.getElementById('chat-form');
  if (chatForm) {
    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = document.getElementById('chat-submit-btn');
      const inputField = document.getElementById('chat-input-field');
      const attachmentInput = document.getElementById('attachment-input');
      
      if (!inputField.value.trim() && (!attachmentInput.files || !attachmentInput.files.length)) {
        return; // Don't send empty messages
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

      let formData = new FormData(this);

      fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur réseau (' + response.status + ')');
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          inputField.value = '';
          clearAttachment();
          appendMessage(data.message);
          chatBox.scrollTop = chatBox.scrollHeight;
        } else {
          alert('Erreur: ' + (data.message || 'Impossible d\'envoyer le message.'));
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'envoi du message : ' + error.message);
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
      });
    });
  }

  // Append new message to chat
  function appendMessage(msg) {
    const isOutgoing = msg.sender_id == currentUserId;
    const time = new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Remove placeholder if it exists
    const placeholder = document.getElementById('no-messages-placeholder');
    if (placeholder) placeholder.remove();

    let html = `<div class="message-bubble ${isOutgoing ? 'message-outgoing' : 'message-incoming'}" data-id="${msg.id}">`;
    
    if (msg.attachment) {
      html += `<div class="message-attachment">
                 <img src="/storage/${msg.attachment}" alt="Pièce jointe" style="max-width: 200px; border-radius: 8px; margin-bottom: 0.5rem; cursor: pointer;" onclick="window.open(this.src, '_blank')">
               </div>`;
    }
    
    if (msg.content) {
      html += `<div>${msg.content}</div>`;
    }
    
    html += `<div style="font-size: 0.65rem; opacity: 0.8; margin-top: 0.35rem; text-align: right;">${time}`;
    if(isOutgoing) {
        html += ` <i class="fa-solid fa-check" style="margin-left: 3px;"></i>`;
    }
    html += `</div></div>`;
    
    messagesContainer.insertAdjacentHTML('beforeend', html);
    
    if (msg.id > lastMessageId) {
      lastMessageId = msg.id;
    }
  }

  // Polling for new messages & marking as read
  if (activeContactId) {
    // Mark as read initially
    fetch(markReadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    setInterval(() => {
      fetch(`${fetchUrl}?last_id=${lastMessageId}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.messages && data.messages.length > 0) {
          data.messages.forEach(msg => {
            appendMessage(msg);
          });
          chatBox.scrollTop = chatBox.scrollHeight;
          
          // Mark as read when new messages arrive
          fetch(markReadUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': csrfToken,
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
        }
      });
    }, 3000); // 3 seconds polling
  }
</script>
@endsection
@endsection
