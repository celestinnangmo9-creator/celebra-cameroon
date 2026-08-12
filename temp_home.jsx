





{/*  Hero Banner  */}
<section className="hero">
  <div className="hero-overlay"></div>
  <div className="hero-content" data-aos="fade-in" data-aos-duration="1000">
    <h1 className="hero-title">Trouvez le lieu parfait pour vos célébrations au Cameroun</h1>
    <p className="hero-subtitle">Salles de fête, jardins d'exception, terrasses VIP et bureaux privatifs à Douala, Yaoundé, Kribi et dans tout le Cameroun.</p>

    {/*  Search Box Form  */}
    <form action="{route('venues.index')}" method="GET" className="search-card" data-aos="fade-up" data-aos-delay="300">
      <div className="form-group" style={{display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap'}}>
        <div style={{flex: '1', minWidth: '150px'}}>
          <label className="form-label"><i className="fa-solid fa-map" style={{color: 'var(--primary)'}}></i> Région</label>
          <select name="region" id="region-select" className="form-control">
            <option value="">Toutes les régions</option>
            {$regionsAndCities.map($region => $cities => ( <React.Fragment key={Math.random()}>
              <option value="{$region}">{$region}</option>
            </React.Fragment> ))}
          </select>
        </div>
        <div style={{flex: '1', minWidth: '150px'}}>
          <label className="form-label"><i className="fa-solid fa-location-dot" style={{color: 'var(--primary)'}}></i> Ville</label>
          <select name="city" id="city-select" className="form-control">
            <option value="">Toutes les villes</option>
            {$regionsAndCities.map($region => $cities => ( <React.Fragment key={Math.random()}>
              <optgroup label="{$region}" data-region="{$region}">
                {$cities.map($city => ( <React.Fragment key={Math.random()}>
                  <option value="{$city}">{$city}</option>
                </React.Fragment> ))}
              </optgroup>
            </React.Fragment> ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label"><i className="fa-solid fa-list-check" style={{color: 'var(--primary)'}}></i> Type de lieu</label>
        <select name="category" className="form-control">
          <option value="">Tous les types</option>
          {$categories.map($category => ( <React.Fragment key={Math.random()}>
            <option value="{$category}">{$category}</option>
          </React.Fragment> ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label"><i className="fa-solid fa-users" style={{color: 'var(--primary)'}}></i> Invités min.</label>
        <input type="number" name="capacity" className="form-control" placeholder="Ex: 100 pers.">
      </div>

      <div className="form-group" style={{alignSelf: 'flex-end'}}>
        <button type="submit" className="btn btn-primary" style={{padding: '0.8rem 2rem', width: '100%'}}>
          <i className="fa-solid fa-magnifying-glass"></i> Rechercher
        </button>
      </div>
    </form>
  </div>
</section>

{/*  Categories Section  */}
<section className="container" style={{marginTop: '1rem'}}>
  <div className="section-title" data-aos="fade-up">Explorez par Catégorie</div>
  <div className="section-subtitle" data-aos="fade-up" data-aos-delay="100">Trouvez l'espace adapté à la taille et au prestige de votre événement.</div>

  <div className="categories-grid">
    <a href="{route('venues.index', ['category' => 'Salle de fête'])}" className="category-card" data-aos="fade-up" data-aos-delay="200">
      <div className="category-icon"><i className="fa-solid fa-champagne-glasses"></i></div>
      <div>
        <div>Salles de Fête</div>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Mariages & Banquets</div>
      </div>
    </a>

    <a href="{route('venues.index', ['category' => 'Espace vert'])}" className="category-card" data-aos="fade-up" data-aos-delay="300">
      <div className="category-icon" style={{background: '#fef3c7', color: '#d97706'}}><i className="fa-solid fa-tree"></i></div>
      <div>
        <div>Espaces Verts</div>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Jardins & Plages Kribi</div>
      </div>
    </a>

    <a href="{route('venues.index', ['category' => 'Terrasse VIP'])}" className="category-card" data-aos="fade-up" data-aos-delay="400">
      <div className="category-icon" style={{background: '#e0e7ff', color: '#4338ca'}}><i className="fa-solid fa-martini-glass-citrus"></i></div>
      <div>
        <div>Terrasses VIP</div>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Rooftops & Cocktails</div>
      </div>
    </a>

    <a href="{route('venues.index', ['category' => 'Bureau & Coworking'])}" className="category-card" data-aos="fade-up" data-aos-delay="500">
      <div className="category-icon" style={{background: '#f3e8ff', color: '#7e22ce'}}><i className="fa-solid fa-briefcase"></i></div>
      <div>
        <div>Bureaux & Coworking</div>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Réunions & Ateliers</div>
      </div>
    </a>

    <a href="{route('venues.index', ['category' => 'Salle de Conférence'])}" className="category-card">
      <div className="category-icon" style={{background: '#e0f2fe', color: '#0284c7'}}><i className="fa-solid fa-microphone-lines"></i></div>
      <div>
        <div>Salles de Conférence</div>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Séminaires & Formations</div>
      </div>
    </a>

    <a href="{route('venues.index', ['category' => 'Pavillon / Villa'])}" className="category-card">
      <div className="category-icon" style={{background: '#ffe4e6', color: '#e11d48'}}><i className="fa-solid fa-house-chimney-window"></i></div>
      <div>
        <div>Villas de Prestige</div>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Piscine & Séjours VIP</div>
      </div>
    </a>
  </div>
</section>

{/*  Latest Venues Grid (Moved to top)  */}
<section className="container" style={{marginBottom: '3rem'}}>
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'}}>
    <div>
      <div className="section-title">Nouvelles Salles Ajoutées</div>
      <div className="section-subtitle">Découvrez les derniers espaces publiés par nos hôtes.</div>
    </div>
  </div>

  <div className="venues-grid">
    {$latestVenues.map($venue => ( <React.Fragment key={Math.random()}>
      <div className="venue-card" data-aos="fade-up" data-aos-delay="{$loop->iteration * 100}">
        <div className="venue-image-wrapper">
          <img src="{$venue->main_image}" alt="{$venue->title}" className="venue-image" style={{objectFit: 'cover'}}>
          <span className="venue-badge" style={{background: 'rgba(5, 150, 105, 0.9)'}}>Nouveau</span>
          <span className="venue-rating"><i className="fa-solid fa-star" style={{color: '#f59e0b'}}></i> {number_format($venue->rating, 2)}</span>
        </div>

        <div className="venue-body">
          <div className="venue-location">
            <i className="fa-solid fa-location-dot"></i> {$venue->city} ({$venue->district})
          </div>
          <h3 className="venue-title">{$venue->title}</h3>
          
          <div className="venue-specs">
            <span><i className="fa-solid fa-users"></i> {$venue->capacity} personnes</span>
            <span style={{color: 'var(--text-muted)'}}>{$venue->category}</span>
          </div>

          <div className="venue-price">
            <div>
              <span className="price-val">{number_format($venue->price_per_day, 0, ',', ' ')} FCFA</span>
              <span className="price-unit">/ jour</span>
            </div>
            <a href="{route('venues.show', $venue->id)}" className="btn btn-outline btn-sm" style={{padding: '0.4rem 1rem', fontSize: '0.85rem'}}>Voir plus</a>
          </div>
        </div>
      </div>
    </React.Fragment> ))}
  </div>
</section>

{/*  Featured Venues Grid  */}
<section className="container">
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'}}>
    <div>
      <div className="section-title">Espaces en Vedette au Cameroun</div>
      <div className="section-subtitle">Sélectionnés pour leur standing, leurs équipements et la satisfaction client.</div>
    </div>
    <a href="{route('venues.index')}" className="btn btn-outline" style={{width: '100%', maxWidth: '300px', textAlign: 'center'}}>Voir tout le catalogue <i className="fa-solid fa-arrow-right"></i></a>
  </div>

  <div className="venues-grid">
    {$featuredVenues.map($venue => ( <React.Fragment key={Math.random()}>
      <div className="venue-card" data-aos="fade-up" data-aos-delay="{$loop->iteration * 100}">
        <div className="venue-image-wrapper">
          <img src="{$venue->main_image}" alt="{$venue->title}" className="venue-image">
          <span className="venue-badge">{$venue->category}</span>
          <span className="venue-rating"><i className="fa-solid fa-star" style={{color: '#f59e0b'}}></i> {number_format($venue->rating, 2)}</span>
        </div>

        <div className="venue-body">
          <div className="venue-location">
            <i className="fa-solid fa-location-dot"></i> {$venue->city} ({$venue->district})
          </div>
          <h3 className="venue-title">{$venue->title}</h3>
          
          <div className="venue-specs">
            <span><i className="fa-solid fa-users"></i> {$venue->capacity} personnes</span>
            <span><i className="fa-solid fa-shield-halved"></i> G. Électrogène</span>
          </div>

          <div className="venue-price">
            <div>
              <span className="price-val">{number_format($venue->price_per_day, 0, ',', ' ')} FCFA</span>
              <span className="price-unit">/ jour</span>
            </div>
            <a href="{route('venues.show', $venue->id)}" className="btn btn-primary btn-sm" style={{padding: '0.4rem 1rem', fontSize: '0.85rem'}}>Découvrir</a>
          </div>
        </div>
      </div>
    </React.Fragment> ))}
  </div>
</section>

{/*  How it works  */}
<section style={{background: 'var(--bg-card)', padding: '5rem 0', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', marginTop: '3rem'}}>
  <div className="container">
    <div style={{textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem'}} data-aos="fade-up">
      <h2 className="section-title">Comment fonctionne Celebra Cameroon ?</h2>
      <p className="section-subtitle">Réservez un lieu d'événement en toute tranquillité grâce à nos garanties et fonctionnalités interactives.</p>
    </div>

    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem'}}>
      <div style={{textAlign: 'center', padding: '2rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-lg)'}} data-aos="fade-up" data-aos-delay="100">
        <div style={{width: '70px', height: '70px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.8rem', fontWeight: '800'}}>1</div>
        <h3 style={{marginBottom: '0.75rem'}}>Trouvez & Filtrez</h3>
        <p style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>Recherchez par ville (Douala, Yaoundé, Kribi...), capacité, budget et équipements.</p>
      </div>

      <div style={{textAlign: 'center', padding: '2rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-lg)'}} data-aos="fade-up" data-aos-delay="200">
        <div style={{width: '70px', height: '70px', background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.8rem', fontWeight: '800'}}>2</div>
        <h3 style={{marginBottom: '0.75rem'}}>Discutez & Visitez</h3>
        <p style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>Échangez directement avec le propriétaire en messagerie interne, passez un appel audio/vidéo ou planifiez une visite physique du lieu.</p>
      </div>

      <div style={{textAlign: 'center', padding: '2rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-lg)'}} data-aos="fade-up" data-aos-delay="300">
        <div style={{width: '70px', height: '70px', background: '#e0e7ff', color: '#4338ca', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.8rem', fontWeight: '800'}}>3</div>
        <h3 style={{marginBottom: '0.75rem'}}>Réservez en Sécurité</h3>
        <p style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>Calculez votre devis instantané et confirmez votre réservation avec paiement sécurisé ou acompte sur place.</p>
      </div>
    </div>
  </div>
</section>




<script>
  document.addEventListener('DOMContentLoaded', function() {
    const regionSelect = document.getElementById('region-select');
    const citySelect = document.getElementById('city-select');
    
    if (regionSelect && citySelect) {
      const allOptgroups = Array.from(citySelect.querySelectorAll('optgroup'));
      
      regionSelect.addEventListener('change', function() {
        const selectedRegion = this.value;
        
        // Reset city select
        citySelect.value = '';
        
        allOptgroups.forEach(optgroup => {
          if (!selectedRegion || optgroup.dataset.region === selectedRegion) {
            optgroup.style.display = '';
          } else {
            optgroup.style.display = 'none';
          }
        });
      });
      
      // Trigger initially if a region is already selected
      regionSelect.dispatchEvent(new Event('change'));
    }
  });
</script>

