import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../Contexts/LanguageContext';

export default function VenuesIndex({ venues, regionsAndCities, categories, filters = {} }) {
    const { t } = useLanguage();
    const { auth } = usePage().props;
    const favoriteVenueIds = auth?.favorite_venue_ids || [];
    const { post: togglePost } = useForm();
    
    // State for mobile drawer
    const [isFilterOpen, setIsFilterOpen] = useState(false);

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
            onSuccess: () => setIsFilterOpen(false) // Close drawer on mobile after applying
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

    // Prevent body scroll when mobile drawer is open
    useEffect(() => {
        if (isFilterOpen && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isFilterOpen]);

    return (
        <PublicLayout>
            <Head title={t('venues.index.page_title')} />
            
            <div className="container py-8">
                {/* Header Banner */}
                <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="section-title text-3xl font-black text-[#0B3D2E]">{t('venues.index.title')}</h1>
                    </div>

                    <div>
                        <Link href={route('venues.create')} className="btn bg-[#C9A227] hover:bg-amber-600 text-white font-bold inline-flex items-center gap-2">
                            <i className="fa-solid fa-plus"></i> {t('venues.index.publish')}
                        </Link>
                    </div>
                </div>

                {/* Mobile Filter Toggle Button & Count */}
                <div className="lg:hidden mb-6 mt-2 flex justify-between items-center bg-[#FAF6F0] p-4 rounded-xl border border-emerald-100">
                    <p className="text-[#0B3D2E] font-bold">{venues.total} {t('venues.index.spaces_found')}</p>
                    <button 
                        onClick={() => setIsFilterOpen(true)}
                        className="btn btn-sm bg-white border border-gray-200 text-[#0B3D2E] shadow-sm flex items-center gap-2 font-bold"
                    >
                        <i className="fa-solid fa-sliders"></i> {t('venues.index.filters')}
                    </button>
                </div>

                <div className="layout-sidebar-main grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
                    
                    {/* Mobile Overlay */}
                    {isFilterOpen && (
                        <div 
                            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                            onClick={() => setIsFilterOpen(false)}
                        />
                    )}

                    {/* Filter Sidebar (Drawer on mobile, Sticky on desktop) */}
                    <aside className={`fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-[#FAF6F0] shadow-2xl lg:shadow-none lg:bg-[#FAF6F0] lg:rounded-2xl lg:border lg:border-emerald-100 lg:static lg:block lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] transition-transform duration-300 ease-in-out ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
                        
                        <div className="p-6 flex-shrink-0 border-b border-gray-200 lg:border-none lg:pb-0 lg:pt-6">
                            <div className="flex justify-between items-center lg:mb-4">
                                <h3 className="text-xl font-black text-[#0B3D2E] flex items-center gap-2 uppercase tracking-wide">
                                    <i className="fa-solid fa-sliders text-[#C9A227]"></i> {t('venues.index.refine')}
                                </h3>
                                <button 
                                    onClick={() => setIsFilterOpen(false)}
                                    className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-500 hover:text-gray-800 shadow-sm"
                                >
                                    <i className="fa-solid fa-xmark text-xl"></i>
                                </button>
                            </div>
                        </div>

                        {/* Scrollable filters area */}
                        <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
                            <form onSubmit={handleFilterSubmit} className="flex flex-col">
                                {/* Keyword */}
                                <div className="form-group border-b border-gray-200/60 pb-5 mb-5">
                                    <label className="form-label block text-sm font-bold text-[#0B3D2E] mb-2">{t('venues.index.search_free')}</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:border-[#0B3D2E] focus:ring-[#0B3D2E] text-sm" 
                                        value={data.search} 
                                        onChange={e => setData('search', e.target.value)} 
                                        placeholder={t('venues.index.search_placeholder')} 
                                    />
                                </div>

                                {/* Region */}
                                <div className="form-group border-b border-gray-200/60 pb-5 mb-5">
                                    <label className="form-label block text-sm font-bold text-[#0B3D2E] mb-2">{t('venues.index.region')}</label>
                                    <select 
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:border-[#0B3D2E] focus:ring-[#0B3D2E] text-sm font-medium" 
                                        value={data.region} 
                                        onChange={e => setData(data => ({ ...data, region: e.target.value, city: '' }))}
                                    >
                                        <option value="">{t('venues.index.all_regions')}</option>
                                        {Object.keys(regionsAndCities).map(region => (
                                            <option key={region} value={region}>{region}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* City */}
                                <div className="form-group border-b border-gray-200/60 pb-5 mb-5">
                                    <label className="form-label block text-sm font-bold text-[#0B3D2E] mb-2">{t('venues.index.city')}</label>
                                    <select 
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:border-[#0B3D2E] focus:ring-[#0B3D2E] text-sm font-medium disabled:opacity-50" 
                                        value={data.city} 
                                        onChange={e => setData('city', e.target.value)}
                                        disabled={!data.region && Object.keys(regionsAndCities).length > 0} // Optional enhancement to guide user
                                    >
                                        <option value="">{t('venues.index.all_cities')}</option>
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
                                <div className="form-group border-b border-gray-200/60 pb-5 mb-5">
                                    <label className="form-label block text-sm font-bold text-[#0B3D2E] mb-2">{t('venues.index.category')}</label>
                                    <select 
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:border-[#0B3D2E] focus:ring-[#0B3D2E] text-sm font-medium" 
                                        value={data.category} 
                                        onChange={e => setData('category', e.target.value)}
                                    >
                                        <option value="">{t('venues.index.all_categories')}</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Capacity */}
                                <div className="form-group border-b border-gray-200/60 pb-5 mb-5">
                                    <label className="form-label block text-sm font-bold text-[#0B3D2E] mb-2">{t('venues.index.capacity')}</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <i className="fa-solid fa-users text-gray-400"></i>
                                        </div>
                                        <input 
                                            type="number" 
                                            className="w-full pl-12 pr-4 bg-white border border-gray-200 rounded-xl py-3 focus:border-[#0B3D2E] focus:ring-[#0B3D2E] text-sm" 
                                            value={data.capacity} 
                                            onChange={e => setData('capacity', e.target.value)} 
                                            placeholder={t('venues.index.capacity_placeholder')} 
                                        />
                                    </div>
                                </div>

                                {/* Max Price */}
                                <div className="form-group mb-6">
                                    <label className="form-label block text-sm font-bold text-[#0B3D2E] mb-2">{t('venues.index.max_price')}</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            className="w-full pr-16 bg-white border border-gray-200 rounded-xl px-4 py-3 focus:border-[#0B3D2E] focus:ring-[#0B3D2E] text-sm font-medium" 
                                            value={data.max_price} 
                                            onChange={e => setData('max_price', e.target.value)} 
                                            placeholder={t('venues.index.price_placeholder')} 
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <span className="text-gray-500 font-bold text-sm">FCFA</span>
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>
                        
                        {/* Sticky Action Footer in Drawer */}
                        <div className="p-6 border-t border-gray-200 bg-[#FAF6F0] rounded-b-2xl">
                            <button 
                                onClick={handleFilterSubmit}
                                disabled={processing} 
                                className="w-full bg-[#0B3D2E] hover:bg-emerald-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform hover:-translate-y-1 flex justify-center items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                <i className="fa-solid fa-magnifying-glass"></i> {t('venues.index.apply')} ({venues.total})
                            </button>

                            {(data.search || data.city || data.category || data.capacity || data.max_price || data.region) && (
                                <Link 
                                    href={route('venues.index')} 
                                    className="block text-center mt-4 text-sm font-bold text-[#C9A227] hover:text-amber-600 transition-colors"
                                >
                                    <i className="fa-solid fa-rotate-left mr-1"></i> {t('venues.index.reset_filters')}
                                </Link>
                            )}
                        </div>
                    </aside>

                    {/* Main Listing Area */}
                    <div>
                        {/* Desktop Count Header */}
                        <div className="hidden lg:flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">
                                {venues.total} <span className="font-normal text-gray-500">{t('venues.index.rooms_found')}</span>
                            </h2>
                            {/* Optionnal sort dropdown could go here */}
                        </div>
                        
                        {venues.data.length === 0 ? (
                            <div className="bg-[#FAF6F0] p-16 rounded-3xl text-center border border-emerald-100/50 shadow-sm mt-4">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <i className="fa-solid fa-magnifying-glass text-4xl text-[#C9A227]"></i>
                                </div>
                                <h3 className="text-2xl font-black text-[#0B3D2E] mb-2">{t('venues.index.no_venues')}</h3>
                                <p className="text-gray-600 max-w-md mx-auto">{t('venues.index.no_venues_desc')}</p>
                                <Link href={route('venues.index')} className="btn bg-white border-2 border-[#0B3D2E] text-[#0B3D2E] hover:bg-[#0B3D2E] hover:text-white mt-8 px-8 py-3 rounded-xl font-bold transition-colors">
                                    {t('venues.index.reset_search')}
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="venues-grid" style={{ marginTop: 0 }}>
                                    {venues.data.map(venue => (
                                        <div key={venue.id} className="venue-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1 group">
                                            <Link href={route('venues.show', venue.id)} className="block">
                                                <div className="venue-image-wrapper relative h-56 overflow-hidden">
                                                    <img src={venue.main_image} alt={venue.title} className="venue-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    
                                                    <span className="venue-badge absolute top-4 left-4 bg-white/95 backdrop-blur shadow-sm px-4 py-1.5 rounded-full text-xs font-black text-[#0B3D2E] uppercase tracking-wide">
                                                        {venue.category}
                                                    </span>
                                                    

                                                    
                                                    <button 
                                                        onClick={(e) => toggleFavorite(e, venue.id)}
                                                        className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md z-10 ${favoriteVenueIds.includes(venue.id) ? 'bg-white text-red-500 scale-110' : 'bg-white/80 text-gray-500 hover:bg-white hover:text-red-500'}`}
                                                        title={t('venues.index.add_favorite')}
                                                    >
                                                        <i className={`${favoriteVenueIds.includes(venue.id) ? 'fa-solid' : 'fa-regular'} fa-heart text-xl`}></i>
                                                    </button>
                                                </div>

                                                <div className="venue-body p-6">
                                                    <div className="venue-location text-xs text-gray-500 mb-3 flex items-center gap-1 uppercase tracking-widest font-bold">
                                                        <i className="fa-solid fa-location-dot text-[#C9A227]"></i> {venue.city} <span className="text-gray-300 mx-1">•</span> {venue.district}
                                                    </div>
                                                    <h3 className="venue-title text-xl font-black text-[#0B3D2E] mb-2 line-clamp-1 group-hover:text-emerald-700 transition-colors">{venue.title}</h3>
                                                    <p className="text-sm text-gray-500 mb-5 line-clamp-2 leading-relaxed">
                                                        {venue.description}
                                                    </p>
                                                    
                                                    <div className="venue-specs flex flex-wrap gap-2 mb-5">
                                                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#0B3D2E] bg-[#FAF6F0] px-3 py-1.5 rounded-lg border border-emerald-50">
                                                            <i className="fa-solid fa-users text-[#C9A227]"></i> {venue.capacity} {t('venues.index.max_guests')}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#0B3D2E] bg-[#FAF6F0] px-3 py-1.5 rounded-lg border border-emerald-50">
                                                            <i className="fa-solid fa-bolt text-[#C9A227]"></i> {t('venues.index.pro_energy')}
                                                        </span>
                                                    </div>

                                                    <div className="venue-price flex items-end justify-between border-t border-gray-100 pt-5 mt-auto">
                                                        <div>
                                                            <p className="text-xs text-gray-400 font-medium mb-0.5">{t('venues.index.starting_from')}</p>
                                                            <div className="flex items-baseline gap-1">
                                                                <span className="price-val text-2xl font-black text-[#0B3D2E]">{new Intl.NumberFormat('fr-FR').format(venue.price_per_day)}</span>
                                                                <span className="price-val text-sm font-bold text-[#0B3D2E]">FCFA</span>
                                                                <span className="price-unit text-xs text-gray-400 font-medium">{t('venues.index.per_day')}</span>
                                                            </div>
                                                            <div className="text-[10px] text-gray-400 mt-1">
                                                                <i className="fa-regular fa-clock"></i> Publié le {new Date(venue.created_at).toLocaleDateString('fr-FR')}
                                                            </div>
                                                        </div>
                                                        <span className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-[#C9A227] group-hover:text-white transition-colors">
                                                            <i className="fa-solid fa-arrow-right"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="mt-12 flex justify-center gap-2 flex-wrap">
                                    {venues.links.map((link, index) => (
                                        <Link 
                                            key={index} 
                                            href={link.url || '#'} 
                                            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm ${link.active ? 'bg-[#0B3D2E] text-white shadow-emerald-900/20' : 'bg-white border border-gray-200 text-gray-600 hover:bg-[#FAF6F0] hover:text-[#0B3D2E]'} ${!link.url ? 'opacity-40 cursor-not-allowed shadow-none' : ''}`}
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
