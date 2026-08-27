import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useLanguage } from '../Contexts/LanguageContext';

export default function Home({ auth, featuredVenues = [], latestVenues = [], regionsAndCities = {}, categories = [] }) {
    const { t } = useLanguage();

    const renderVenueCard = (venue) => (
        <div key={venue.id} className="venue-card bg-white dark:bg-slate-800 relative">
            <Link href={route('venues.show', venue.id)} className="block">
                <div className="venue-image-wrapper h-56">
                    <img src={venue.main_image} alt={venue.title} className="w-full h-full object-cover" />
                    <span className="venue-badge absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-400 border border-white/50 dark:border-slate-700/50 shadow-sm">{venue.category}</span>
                </div>
                <div className="venue-body p-6 text-left">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1 uppercase tracking-wider font-semibold">
                        <i className="fa-solid fa-location-dot text-emerald-500"></i> {venue.city} - {venue.district}
                    </div>
                    <h3 className="venue-title text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1" style={{fontFamily: 'Fraunces, serif'}}>{venue.title}</h3>
                    
                    <div className="flex flex-wrap gap-3 mb-5 text-xs font-medium text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1 bg-gray-50 dark:bg-slate-700 px-2.5 py-1.5 rounded-lg"><i className="fa-solid fa-users text-emerald-500"></i> {venue.capacity} max</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-700 pt-4 mt-2">
                        <div>
                            <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">{new Intl.NumberFormat('fr-FR').format(venue.price_per_day)} FCFA</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 block">{t('home.per_day')}</span>
                        </div>
                        <span className="btn btn-primary px-5 py-2.5 text-sm">{t('home.view_listing')}</span>
                    </div>
                </div>
            </Link>
        </div>
    );

    return (
        <PublicLayout auth={auth}>
            <Head title={t('head.home_title')} />
            

{/*  Hero Banner  */}
<section className="hero" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
  <div className="hero-overlay"></div>
  <div className="hero-content" data-aos="fade-in" data-aos-duration="1000">
    <h1 className="hero-title">{t('home.hero_title_1')}<br/>{t('home.hero_title_2')}</h1>
    <p className="hero-subtitle">{t('home.hero_subtitle')}</p>

    {!auth?.user && (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }} data-aos="fade-up" data-aos-delay="200">
            <Link href={route('register')} className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                {t('nav.register')}
            </Link>
            <Link href={route('login')} className="btn btn-outline" style={{ padding: '0.75rem 2rem', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold', border: '2px solid white', color: 'white' }}>
                {t('nav.login')}
            </Link>
        </div>
    )}

    {/*  Search Box Form  */}
    <form action={route('venues.index')} method="GET" className="premium-search-bar" data-aos="fade-up" data-aos-delay="300">
      
        <div>
          <label className="form-label" style={{color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem'}}><i className="fa-solid fa-map"></i> {t('home.region')}</label>
          <select name="region" id="region-select" className="form-control search-field" style={{background: 'transparent', border: 'none', padding: '0'}}>
            <option value="">{t('home.all_regions')}</option>
            {Object.keys(regionsAndCities).map(region => (
                <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        
        <div className="search-divider"></div>
        
        <div>
          <label className="form-label" style={{color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem'}}><i className="fa-solid fa-location-dot"></i> {t('home.location')}</label>
          <select name="city" id="city-select" className="form-control search-field" style={{background: 'transparent', border: 'none', padding: '0'}}>
            <option value="">{t('home.all_cities')}</option>
            {Object.entries(regionsAndCities).map(([region, cities]) => (
                <optgroup key={region} label={region}>
                    {cities.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </optgroup>
            ))}
          </select>
        </div>

      <div className="search-divider" style={{width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)'}}></div>

      <div>
        <label className="form-label" style={{color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem'}}><i className="fa-solid fa-list-check"></i> {t('home.type')}</label>
        <select name="category" className="form-control search-field" style={{background: 'transparent', border: 'none', padding: '0'}}>
          <option value="">{t('home.all_types')}</option>
          {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="search-divider" style={{width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)'}}></div>

      <div>
        <label className="form-label" style={{color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem'}}><i className="fa-solid fa-users"></i> {t('home.guests')}</label>
        <input type="number" name="capacity" className="form-control search-field" style={{background: 'transparent', border: 'none', padding: '0'}} placeholder="Ex: 100" />
      </div>

      <div className="search-submit-container">
        <button type="submit" className="search-submit-btn">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
    </form>
  </div>
</section>

{/*  Categories Section  */}
<section className="container" style={{marginTop: '1rem'}}>
  <div className="section-title" data-aos="fade-up">{t('home.explore_category')}</div>
  <div className="section-subtitle" data-aos="fade-up" data-aos-delay="100">{t('home.explore_desc')}</div>

  <div className="categories-grid">
    <Link href={route('venues.index', { category: 'Salle de fête' })} className="category-card" data-aos="fade-up" data-aos-delay="200">
      <div className="category-icon"><i className="fa-solid fa-champagne-glasses"></i></div>
      <div>
        <div>{t('home.cat_party')}</div>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{t('home.cat_party_desc')}</div>
      </div>
    </Link>

    <Link href={route('venues.index', { category: 'Espace vert' })} className="category-card" data-aos="fade-up" data-aos-delay="300">
      <div className="category-icon" style={{background: '#fef3c7', color: '#d97706'}}><i className="fa-solid fa-tree"></i></div>
      <div>
        <div>{t('home.cat_green')}</div>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{t('home.cat_green_desc')}</div>
      </div>
    </Link>

    <Link href={route('venues.index', { category: 'Terrasse VIP' })} className="category-card" data-aos="fade-up" data-aos-delay="400">
      <div className="category-icon" style={{background: '#e0e7ff', color: '#4338ca'}}><i className="fa-solid fa-martini-glass-citrus"></i></div>
      <div>
        <div>{t('home.cat_vip')}</div>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{t('home.cat_vip_desc')}</div>
      </div>
    </Link>

    <Link href={route('venues.index', { category: 'Bureau & Coworking' })} className="category-card" data-aos="fade-up" data-aos-delay="500">
      <div className="category-icon" style={{background: '#f3e8ff', color: '#7e22ce'}}><i className="fa-solid fa-briefcase"></i></div>
      <div>
        <div>{t('home.cat_office')}</div>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{t('home.cat_office_desc')}</div>
      </div>
    </Link>

    <Link href={route('venues.index', { category: 'Salle de Conférence' })} className="category-card">
      <div className="category-icon" style={{background: '#e0f2fe', color: '#0284c7'}}><i className="fa-solid fa-microphone-lines"></i></div>
      <div>
        <div>{t('home.cat_conf')}</div>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{t('home.cat_conf_desc')}</div>
      </div>
    </Link>

    <Link href={route('venues.index', { category: 'Pavillon / Villa' })} className="category-card">
      <div className="category-icon" style={{background: '#ffe4e6', color: '#e11d48'}}><i className="fa-solid fa-house-chimney-window"></i></div>
      <div>
        <div>{t('home.cat_villa')}</div>
        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{t('home.cat_villa_desc')}</div>
      </div>
    </Link>
  </div>
</section>

{/*  Latest Venues Grid (Moved to top)  */}
<section className="container" style={{marginBottom: '3rem'}}>
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'}}>
    <div>
      <div className="section-title">{t('home.latest_venues')}</div>
      <div className="section-subtitle">{t('home.latest_venues_desc')}</div>
    </div>
  </div>

  <div className="venues-grid">
    {latestVenues.length > 0 ? latestVenues.map(renderVenueCard) : <p>{t('home.no_latest')}</p>}
  </div>
</section>

{/*  Featured Venues Grid  */}
<section className="container">
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'}}>
    <div>
      <div className="section-title">{t('home.featured_venues')}</div>
      <div className="section-subtitle">{t('home.featured_desc')}</div>
    </div>
    <a href={route('venues.index')} className="btn btn-outline" style={{width: '100%', maxWidth: '18.75rem', textAlign: 'center'}}>{t('home.view_all')} <i className="fa-solid fa-arrow-right"></i></a>
  </div>

  <div className="venues-grid">
    {featuredVenues.length > 0 ? featuredVenues.map(renderVenueCard) : <p>{t('home.no_featured')}</p>}
  </div>
</section>

{/*  How it works  */}
<section style={{background: 'var(--bg-card)', padding: '5rem 0', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', marginTop: '3rem'}}>
  <div className="container">
    <div style={{textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem'}} data-aos="fade-up">
      <h2 className="section-title">{t('home.how_it_works')}</h2>
      <p className="section-subtitle">{t('home.how_it_works_desc')}</p>
    </div>

    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 17.5rem), 1fr))', gap: '2rem'}}>
      <div style={{textAlign: 'center', padding: '2rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-lg)'}} data-aos="fade-up" data-aos-delay="100">
        <div style={{width: '4.375rem', height: '4.375rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.8rem', fontWeight: '800'}}>1</div>
        <h3 style={{marginBottom: '0.75rem'}}>{t('home.step1_title')}</h3>
        <p style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>{t('home.step1_desc')}</p>
      </div>

      <div style={{textAlign: 'center', padding: '2rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-lg)'}} data-aos="fade-up" data-aos-delay="200">
        <div style={{width: '4.375rem', height: '4.375rem', background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.8rem', fontWeight: '800'}}>2</div>
        <h3 style={{marginBottom: '0.75rem'}}>{t('home.step2_title')}</h3>
        <p style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>{t('home.step2_desc')}</p>
      </div>

      <div style={{textAlign: 'center', padding: '2rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-lg)'}} data-aos="fade-up" data-aos-delay="300">
        <div style={{width: '4.375rem', height: '4.375rem', background: '#e0e7ff', color: '#4338ca', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.8rem', fontWeight: '800'}}>3</div>
        <h3 style={{marginBottom: '0.75rem'}}>{t('home.step3_title')}</h3>
        <p style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>{t('home.step3_desc')}</p>
      </div>
    </div>
  </div>
</section>


        </PublicLayout>
    );
}
