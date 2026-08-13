import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect } from 'react';

export default function VenuesIndex({ venues, regionsAndCities, categories, filters = {} }) {
    const { auth } = usePage().props;
    const favoriteVenueIds = auth?.favorite_venue_ids || [];
    const { post: togglePost } = useForm();
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        region: filters.region || '',
        city: filters.city || '',
        category: filters.category || '',
        capacity: filters.capacity || '',
        max_price: filters.max_price || '',
    });

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        get(route('venues.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const toggleFavorite = (e, venueId) => {
        e.preventDefault(); // Prevent navigating to show page
        if (!auth.user) {
            window.location.href = route('login');
            return;
        }
        togglePost(route('favorites.toggle', venueId), { preserveScroll: true });
    };

    return (
        <PublicLayout>
            <Head title="Catalogue des Lieux & Salles au Cameroun - Celebra Cameroon" />
            
            <div className="container py-8">
                {/* Header Banner */}
                <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="section-title text-3xl font-bold text-gray-900">Catalogue des Lieux Événementiels</h1>
                        <p className="section-subtitle text-gray-600 mt-2">{venues.total} espace(s) disponible(s) à la location au Cameroun</p>
                    </div>

                    <div>
                        <Link href={route('venues.create')} className="btn btn-accent inline-flex items-center gap-2">
                            <i className="fa-solid fa-plus"></i> Publier une salle
                        </Link>
                    </div>
                </div>

                <div className="layout-sidebar-main grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
                    
                    {/* Filter Sidebar */}
                    <aside className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
                        <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-800">
                            <i className="fa-solid fa-sliders text-emerald-600"></i> Filtres de recherche
                        </h3>

                        <form onSubmit={handleFilterSubmit} className="flex flex-col gap-5">
                            {/* Keyword */}
                            <div className="form-group">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Mot-clé / Quartier</label>
                                <input 
                                    type="text" 
                                    className="form-control w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" 
                                    value={data.search} 
                                    onChange={e => setData('search', e.target.value)} 
                                    placeholder="Ex: Bonapriso, Piscine..." 
                                />
                            </div>

                            {/* Region */}
                            <div className="form-group">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Région</label>
                                <select 
                                    className="form-control w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" 
                                    value={data.region} 
                                    onChange={e => {
                                        setData(data => ({ ...data, region: e.target.value, city: '' })); // Reset city when region changes
                                    }}
                                >
                                    <option value="">Toutes les régions</option>
                                    {Object.keys(regionsAndCities).map(region => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>

                            {/* City */}
                            <div className="form-group">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Ville</label>
                                <select 
                                    className="form-control w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" 
                                    value={data.city} 
                                    onChange={e => setData('city', e.target.value)}
                                >
                                    <option value="">Toutes les villes</option>
                                    {Object.entries(regionsAndCities).map(([region, cities]) => {
                                        if (data.region && data.region !== region) return null;
                                        return (
                                            <optgroup key={region} label={region}>
                                                {cities.map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </optgroup>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Category */}
                            <div className="form-group">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                <select 
                                    className="form-control w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" 
                                    value={data.category} 
                                    onChange={e => setData('category', e.target.value)}
                                >
                                    <option value="">Toutes les catégories</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Capacity */}
                            <div className="form-group">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Capacité minimale (Pers.)</label>
                                <input 
                                    type="number" 
                                    className="form-control w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" 
                                    value={data.capacity} 
                                    onChange={e => setData('capacity', e.target.value)} 
                                    placeholder="Ex: 150" 
                                />
                            </div>

                            {/* Min/Max Price */}
                            <div className="form-group">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Budget max / jour (FCFA)</label>
                                <input 
                                    type="number" 
                                    className="form-control w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500" 
                                    value={data.max_price} 
                                    onChange={e => setData('max_price', e.target.value)} 
                                    placeholder="Ex: 300000" 
                                />
                            </div>

                            <button type="submit" disabled={processing} className="btn btn-primary w-full mt-2 inline-flex items-center justify-center gap-2">
                                <i className="fa-solid fa-filter"></i> Appliquer les filtres
                            </button>

                            {(data.search || data.city || data.category || data.capacity || data.max_price) && (
                                <Link href={route('venues.index')} className="btn btn-ghost text-center text-sm mt-2">
                                    Réinitialiser les filtres
                                </Link>
                            )}
                        </form>
                    </aside>

                    {/* Main Listing Area */}
                    <div>
                        {venues.data.length === 0 ? (
                            <div className="bg-white p-16 rounded-2xl text-center border border-gray-100 shadow-sm">
                                <i className="fa-solid fa-magnifying-glass text-5xl text-gray-300 mb-4"></i>
                                <h3 className="text-xl font-bold text-gray-800">Aucun lieu ne correspond à votre recherche</h3>
                                <p className="text-gray-500 mt-2">Essayez de modifier vos critères de filtrage ou sélectionnez une autre ville.</p>
                                <Link href={route('venues.index')} className="btn btn-outline mt-6 inline-block">Voir toutes les salles</Link>
                            </div>
                        ) : (
                            <>
                                <div className="venues-grid" style={{ marginTop: 0 }}>
                                    {venues.data.map(venue => (
                                        <div key={venue.id} className="venue-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-lg">
                                            <Link href={route('venues.show', venue.id)} className="block">
                                                <div className="venue-image-wrapper relative h-48 overflow-hidden">
                                                    <img src={venue.main_image} alt={venue.title} className="venue-image w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                                                    <span className="venue-badge absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-800">{venue.category}</span>
                                                    <span className="venue-rating absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold text-gray-800 flex items-center gap-1">
                                                        <i className="fa-solid fa-star text-amber-500"></i> {Number(venue.rating).toFixed(2)}
                                                    </span>
                                                    
                                                    <button 
                                                        onClick={(e) => toggleFavorite(e, venue.id)}
                                                        className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${favoriteVenueIds.includes(venue.id) ? 'bg-white/90 text-red-500' : 'bg-white/50 text-gray-500 hover:bg-white/90 hover:text-red-500'}`}
                                                        title="Ajouter aux favoris"
                                                    >
                                                        <i className={`${favoriteVenueIds.includes(venue.id) ? 'fa-solid' : 'fa-regular'} fa-heart text-lg`}></i>
                                                    </button>
                                                </div>

                                                <div className="venue-body p-5">
                                                    <div className="venue-location text-xs text-gray-500 mb-2 flex items-center gap-1 uppercase tracking-wider font-semibold">
                                                        <i className="fa-solid fa-location-dot text-emerald-500"></i> {venue.city} - {venue.district}
                                                    </div>
                                                    <h3 className="venue-title text-lg font-bold text-gray-900 mb-2 line-clamp-1">{venue.title}</h3>
                                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                                        {venue.description}
                                                    </p>
                                                    
                                                    <div className="venue-specs flex flex-wrap gap-3 mb-4 text-xs font-medium text-gray-600 bg-gray-50 p-2 rounded-lg">
                                                        <span className="flex items-center gap-1"><i className="fa-solid fa-users text-gray-400"></i> {venue.capacity} max</span>
                                                        <span className="flex items-center gap-1"><i className="fa-solid fa-bolt text-gray-400"></i> G. Électrogène</span>
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
                                    ))}
                                </div>

                                {/* Pagination Custom logic could be added here if needed, but since it's Inertia, we'd loop over venues.links */}
                                <div className="mt-8 flex justify-center gap-2 flex-wrap">
                                    {venues.links.map((link, index) => (
                                        <Link 
                                            key={index} 
                                            href={link.url || '#'} 
                                            className={`px-4 py-2 rounded-lg text-sm font-medium ${link.active ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
