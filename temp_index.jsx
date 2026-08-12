




<div className="container">

  {/*  Header Banner  */}
  <div style={{marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'}}>
    <div>
      <h1 className="section-title">Catalogue des Lieux Événementiels</h1>
      <p className="section-subtitle">{$venues->total()} espace(s) disponible(s) à la location au Cameroun</p>
    </div>

    <div>
      <a href="{route('venues.create')}" className="btn btn-accent"><i className="fa-solid fa-plus"></i> Publier une salle</a>
    </div>
  </div>

  <div className="layout-sidebar-main">
    
    {/*  Filter Sidebar  */}
    <aside style={{background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', height: 'fit-content'}}>
      <h3 style={{marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
        <i className="fa-solid fa-sliders" style={{color: 'var(--primary)'}}></i> Filtres de recherche
      </h3>

      <form action="{route('venues.index')}" method="GET" style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
        {/*  Keyword  */}
        <div className="form-group">
          <label className="form-label">Mot-clé / Quartier</label>
          <input type="text" name="search" className="form-control" value="{request('search')}" placeholder="Ex: Bonapriso, Piscine...">
        </div>

        {/*  Region  */}
        <div className="form-group">
          <label className="form-label">Région</label>
          <select name="region" id="region-select" className="form-control">
            <option value="">Toutes les régions</option>
            {$regionsAndCities.map($region => $cities => ( <React.Fragment key={Math.random()}>
              <option value="{$region}" {request('region') == $region ? 'selected' : ''}>{$region}</option>
            </React.Fragment> ))}
          </select>
        </div>

        {/*  City  */}
        <div className="form-group">
          <label className="form-label">Ville</label>
          <select name="city" id="city-select" className="form-control">
            <option value="">Toutes les villes</option>
            {$regionsAndCities.map($region => $cities => ( <React.Fragment key={Math.random()}>
              <optgroup label="{$region}" data-region="{$region}">
                {$cities.map($c => ( <React.Fragment key={Math.random()}>
                  <option value="{$c}" {request('city') == $c ? 'selected' : ''}>{$c}</option>
                </React.Fragment> ))}
              </optgroup>
            </React.Fragment> ))}
          </select>
        </div>

        {/*  Category  */}
        <div className="form-group">
          <label className="form-label">Catégorie</label>
          <select name="category" className="form-control">
            <option value="">Toutes les catégories</option>
            {$categories.map($cat => ( <React.Fragment key={Math.random()}>
              <option value="{$cat}" {request('category') == $cat ? 'selected' : ''}>{$cat}</option>
            </React.Fragment> ))}
          </select>
        </div>

        {/*  Capacity  */}
        <div className="form-group">
          <label className="form-label">Capacité minimale (Pers.)</label>
          <input type="number" name="capacity" className="form-control" value="{request('capacity')}" placeholder="Ex: 150">
        </div>

        {/*  Min/Max Price  */}
        <div className="form-group">
          <label className="form-label">Budget max / jour (FCFA)</label>
          <input type="number" name="max_price" className="form-control" value="{request('max_price')}" placeholder="Ex: 300000">
        </div>

        <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '0.5rem'}}>
          <i className="fa-solid fa-filter"></i> Appliquer les filtres
        </button>

        {(request() ? ( <React.Fragment>->anyFilled(['search', 'city', 'category', 'capacity', 'max_price']))
          <a href="{route('venues.index')}" className="btn btn-ghost" style={{textAlign: 'center', fontSize: '0.85rem'}}>
            Réinitialiser les filtres
          </a>
        </React.Fragment> )}
      </form>
    </aside>

    {/*  Main Listing Area  */}
    <div>
      {($venues->isEmpty() ? ( <React.Fragment>)
        <div style={{background: 'var(--bg-card)', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--glass-border)'}}>
          <i className="fa-solid fa-magnifying-glass" style={{fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem'}}></i>
          <h3>Aucun lieu ne correspond à votre recherche</h3>
          <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>Essayez de modifier vos critères de filtrage ou sélectionnez une autre ville.</p>
          <a href="{route('venues.index')}" className="btn btn-outline" style={{marginTop: '1.5rem'}}>Voir toutes les salles</a>
        </div>
      </React.Fragment> ) : ( <React.Fragment>
        <div className="venues-grid" style={{marginTop: '0'}}>
          {$venues.map($venue => ( <React.Fragment key={Math.random()}>
            <div className="venue-card">
              <div className="venue-image-wrapper">
                <img src="{$venue->main_image}" alt="{$venue->title}" className="venue-image">
                <span className="venue-badge">{$venue->category}</span>
                <span className="venue-rating"><i className="fa-solid fa-star" style={{color: '#f59e0b'}}></i> {number_format($venue->rating, 2)}</span>
              </div>

              <div className="venue-body">
                <div className="venue-location">
                  <i className="fa-solid fa-location-dot"></i> {$venue->city} - {$venue->district}
                </div>
                <h3 className="venue-title">{$venue->title}</h3>
                <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                  {$venue->description}
                </p>
                
                <div className="venue-specs">
                  <span><i className="fa-solid fa-users"></i> {$venue->capacity} max</span>
                  <span><i className="fa-solid fa-bolt"></i> G. Électrogène</span>
                </div>

                <div className="venue-price">
                  <div>
                    <span className="price-val">{number_format($venue->price_per_day, 0, ',', ' ')} FCFA</span>
                    <span className="price-unit">/ jour</span>
                  </div>
                  <a href="{route('venues.show', $venue->id)}" className="btn btn-primary btn-sm" style={{padding: '0.4rem 1rem', fontSize: '0.85rem'}}>Voir l'annonce</a>
                </div>
              </div>
            </div>
          </React.Fragment> ))}
        </div>

        <div style={{marginTop: '2rem'}}>
          {$venues->links()}
        </div>
      </React.Fragment> )}
    </div>

  </div>

</div>



<script>
  document.addEventListener('DOMContentLoaded', function() {
    const regionSelect = document.getElementById('region-select');
    const citySelect = document.getElementById('city-select');
    
    if (regionSelect && citySelect) {
      const allOptgroups = Array.from(citySelect.querySelectorAll('optgroup'));
      
      regionSelect.addEventListener('change', function() {
        const selectedRegion = this.value;
        
        // Reset city select if changing to a new region
        // Wait, keep current value if it's the initial load, only reset if user actually changes it interactively?
        // Let's just handle display:
        allOptgroups.forEach(optgroup => {
          if (!selectedRegion || optgroup.dataset.region === selectedRegion) {
            optgroup.style.display = '';
          } else {
            optgroup.style.display = 'none';
          }
        });
      });
      
      // Trigger initially
      regionSelect.dispatchEvent(new Event('change'));
    }
  });
</script>

