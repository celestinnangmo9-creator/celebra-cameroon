import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Home({ auth, featuredVenues = [], latestVenues = [], regionsAndCities = {}, categories = [] }) {
    const renderVenueCard = (venue) => (
        <div key={venue.id} className="venue-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-lg">
            <Link href={route('venues.show', venue.id)} className="block">
                <div className="venue-image-wrapper relative h-48 overflow-hidden">
                    <img src={venue.main_image} alt={venue.title} className="venue-image w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                    <span className="venue-badge absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-800">{venue.category}</span>
                    <span className="venue-rating absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold text-gray-800 flex items-center gap-1">
                        <i className="fa-solid fa-star text-amber-500"></i> {Number(venue.rating).toFixed(2)}
                    </span>
                </div>
                <div className="venue-body p-5 text-left">
                    <div className="venue-location text-xs text-gray-500 mb-2 flex items-center gap-1 uppercase tracking-wider font-semibold">
                        <i className="fa-solid fa-location-dot text-emerald-500"></i> {venue.city} - {venue.district}
                    </div>
                    <h3 className="venue-title text-lg font-bold text-gray-900 mb-2 line-clamp-1">{venue.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {venue.description}
                    </p>
                    <div className="venue-specs flex flex-wrap gap-3 mb-4 text-xs font-medium text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <span className="flex items-center gap-1"><i className="fa-solid fa-users text-gray-400"></i> {venue.capacity} max</span>
                    </div>
                    <div className="venue-price flex items-center justify-between border-t border-gray-100 pt-4">
                        <div>
                            <span className="price-val text-lg font-black text-gray-900">{new Intl.NumberFormat('fr-FR').format(venue.price_per_day)} FCFA</span>
                            <span className="price-unit text-xs text-gray-500 ml-1">/ jour</span>
                        </div>
                        <span className="btn btn-primary btn-sm px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white font-semibold transition-colors hover:bg-emerald-700">Voir l'annonce</span>
                    </div>
                </div>
            </Link>
        </div>
    );

    return (
        <PublicLayout auth={auth}>
            <Head title="Celebra Cameroon - Trouver & Réserver des Salles" />
            

{/*  Hero Banner  */}
<section className="hero">
  <div className="hero-overlay"></div>
  <div className="hero-content" data-aos="fade-in" data-aos-duration="1000">
    <h1 className="hero-title">Trouvez le lieu parfait pour vos célébrations au Cameroun</h1>
    <p className="hero-subtitle">Salles de fête, jardins d'exception, terrasses VIP et bureaux privatifs à Douala, Yaoundé, Kribi et dans tout le Cameroun.</p>

    {/*  Search Box Form  */}
    <form action={route('venues.index')} method="GET" className="search-card" data-aos="fade-up" data-aos-delay="300">
      <div className="form-group" style={{display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap'}}>
        <div style={{flex: '1', minWidth: '150px'}}>
          <label className="form-label"><i className="fa-solid fa-map" style={{color: 'var(--primary)'}}></i> Région</label>
          <select name="region" id="region-select" className="form-control">
            <option value="">Toutes les régions</option>
            {Object.keys(regionsAndCities).map(region => (
                <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        <div style={{flex: '1', minWidth: '150px'}}>
          <label className="form-label"><i className="fa-solid fa-location-dot" style={{color: 'var(--primary)'}}></i> Ville</label>
          <select name="city" id="city-select" className="form-control">
            <option value="">Toutes les villes</option>
            {Object.entries(regionsAndCities).map(([region, cities]) => (
                <optgroup key={region} label={region}>
                    {cities.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label"><i className="fa-solid fa-list-check" style={{color: 'var(--primary)'}}></i> Type de lieu</label>
        <select name="category" className="form-control">
          <option value="">Tous les types</option>
          {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label"><i className="fa-solid fa-users" style={{color: 'var(--primary)'}}></i> Invités min.</label>
        <input type="number" name="capacity" className="form-control" placeholder="Ex: 100 pers." />
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
    <a href={route('venues.index')} className="category-card" data-aos="fade-up" data-aos-delay="200">
      <div className="category-icon"><i className="fa-solid fa-champagne-glasses"></i></div>
      <div>
        <div>Salles de Fête</div>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Mariages & Banquets</div>
      </div>
    </a>

    <a href={route('venues.index')} className="category-card" data-aos="fade-up" data-aos-delay="300">
      <div className="category-icon" style={{background: '#fef3c7', color: '#d97706'}}><i className="fa-solid fa-tree"></i></div>
      <div>
        <div>Espaces Verts</div>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Jardins & Plages Kribi</div>
      </div>
    </a>

    <a href={route('venues.index')} className="category-card" data-aos="fade-up" data-aos-delay="400">
      <div className="category-icon" style={{background: '#e0e7ff', color: '#4338ca'}}><i className="fa-solid fa-martini-glass-citrus"></i></div>
      <div>
        <div>Terrasses VIP</div>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Rooftops & Cocktails</div>
      </div>
    </a>

    <a href={route('venues.index')} className="category-card" data-aos="fade-up" data-aos-delay="500">
      <div className="category-icon" style={{background: '#f3e8ff', color: '#7e22ce'}}><i className="fa-solid fa-briefcase"></i></div>
      <div>
        <div>Bureaux & Coworking</div>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Réunions & Ateliers</div>
      </div>
    </a>

    <a href={route('venues.index')} className="category-card">
      <div className="category-icon" style={{background: '#e0f2fe', color: '#0284c7'}}><i className="fa-solid fa-microphone-lines"></i></div>
      <div>
        <div>Salles de Conférence</div>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Séminaires & Formations</div>
      </div>
    </a>

    <a href={route('venues.index')} className="category-card">
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
    {latestVenues.length > 0 ? latestVenues.map(renderVenueCard) : <p>Aucune salle récemment ajoutée.</p>}
  </div>
</section>

{/*  Featured Venues Grid  */}
<section className="container">
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'}}>
    <div>
      <div className="section-title">Espaces en Vedette au Cameroun</div>
      <div className="section-subtitle">Sélectionnés pour leur standing, leurs équipements et la satisfaction client.</div>
    </div>
    <a href={route('venues.index')} className="btn btn-outline" style={{width: '100%', maxWidth: '300px', textAlign: 'center'}}>Voir tout le catalogue <i className="fa-solid fa-arrow-right"></i></a>
  </div>

  <div className="venues-grid">
    {featuredVenues.length > 0 ? featuredVenues.map(renderVenueCard) : <p>Aucun espace en vedette.</p>}
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


        </PublicLayout>
    );
}
