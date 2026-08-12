import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect } from 'react';
import flatpickr from 'flatpickr';
import { French } from 'flatpickr/dist/l10n/fr.js';

export default function VenueShow({ venue, similarVenues, bookedDates }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    
    const [mainImage, setMainImage] = useState(venue.main_image);
    
    // Process gallery images (assuming they are in a JSON array or similar)
    // If it's a string, we parse it, otherwise we use it
    let galleryImages = [];
    if (typeof venue.images === 'string') {
        try {
            galleryImages = JSON.parse(venue.images);
        } catch (e) {
            galleryImages = [];
        }
    } else if (Array.isArray(venue.images)) {
        galleryImages = venue.images;
    }

    const { data, setData, post, processing, errors, reset } = useForm({
        venue_id: venue.id,
        start_date: '',
        end_date: '',
        guest_count: 1,
        message: ''
    });

    const [totalPrice, setTotalPrice] = useState(0);

    // Initialize date picker
    useEffect(() => {
        flatpickr("#dateRangePicker", {
            mode: "range",
            minDate: "today",
            dateFormat: "Y-m-d",
            locale: French,
            disable: bookedDates,
            onChange: function(selectedDates) {
                if (selectedDates.length === 2) {
                    const start = selectedDates[0];
                    const end = selectedDates[1];
                    const diffTime = Math.abs(end - start);
                    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
                    
                    const tzOffset = start.getTimezoneOffset() * 60000;
                    const localStart = new Date(start.getTime() - tzOffset).toISOString().split('T')[0];
                    const localEnd = new Date(end.getTime() - tzOffset).toISOString().split('T')[0];

                    setData(data => ({
                        ...data,
                        start_date: localStart,
                        end_date: localEnd
                    }));
                    
                    setTotalPrice(diffDays * venue.price_per_day);
                } else {
                    setData(data => ({ ...data, start_date: '', end_date: '' }));
                    setTotalPrice(0);
                }
            }
        });
    }, [bookedDates, venue.price_per_day]);

    const submitBooking = (e) => {
        e.preventDefault();
        if (!user) {
            window.location.href = route('login');
            return;
        }
        post(route('bookings.store'));
    };

    return (
        <PublicLayout>
            <Head title={`${venue.title} - Celebra Cameroon`} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Premium Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 h-auto md:h-[500px] rounded-3xl overflow-hidden shadow-sm">
                    {/* Main Image */}
                    <div className="h-64 md:h-full cursor-pointer overflow-hidden relative group">
                        <img 
                            src={mainImage} 
                            alt={venue.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                    </div>

                    {/* Sub Images Grid */}
                    <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-4 h-full">
                        {galleryImages.slice(0, 4).map((img, i) => (
                            <div key={i} className="overflow-hidden relative group cursor-pointer" onClick={() => setMainImage(img)}>
                                <img 
                                    src={img} 
                                    alt="Gallery" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                            </div>
                        ))}
                        
                        {galleryImages.length === 0 && (
                            <div className="col-span-2 row-span-2 bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400 font-medium">Aucune photo supplémentaire</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative pb-20">
                    
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2">
                        {/* Title & Badges */}
                        <div className="mb-8 border-b border-gray-100 pb-8">
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                                {venue.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-gray-600 font-medium">
                                <span className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-100">
                                    <i className="fa-solid fa-tag"></i> {venue.category}
                                </span>
                                <span className="flex items-center gap-2">
                                    <i className="fa-solid fa-location-dot text-emerald-600"></i> {venue.city}, {venue.district}
                                </span>
                                <span className="flex items-center gap-2">
                                    <i className="fa-solid fa-star text-amber-500"></i> {Number(venue.rating).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-10 border-b border-gray-100 pb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos de ce lieu</h2>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                                {venue.description}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div className="mb-10 border-b border-gray-100 pb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ce que propose ce lieu</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                <div className="flex items-center gap-4 text-gray-700 text-lg">
                                    <i className="fa-solid fa-users text-gray-400 w-6 text-center text-xl"></i>
                                    <span>Capacité de {venue.capacity} personnes</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-700 text-lg">
                                    <i className="fa-solid fa-bolt text-gray-400 w-6 text-center text-xl"></i>
                                    <span>Groupe électrogène (si coupure)</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-700 text-lg">
                                    <i className="fa-solid fa-wind text-gray-400 w-6 text-center text-xl"></i>
                                    <span>Entièrement climatisé</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-700 text-lg">
                                    <i className="fa-solid fa-square-parking text-gray-400 w-6 text-center text-xl"></i>
                                    <span>Parking sécurisé</span>
                                </div>
                            </div>
                        </div>

                        {/* Host Info */}
                        <div className="flex items-center gap-6 mb-10">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl font-bold">
                                {venue.user?.name?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Hôte : {venue.user?.name}</h3>
                                <p className="text-gray-500">Membre depuis {new Date(venue.user?.created_at).getFullYear()}</p>
                            </div>
                            {user && user.id !== venue.user_id && (
                                <Link href="#" className="ml-auto btn btn-outline">Contacter l'hôte</Link>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Booking Widget */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
                            
                            <div className="mb-6 flex items-end gap-2 border-b border-gray-100 pb-6">
                                <span className="text-3xl font-black text-gray-900">{new Intl.NumberFormat('fr-FR').format(venue.price_per_day)} FCFA</span>
                                <span className="text-gray-500 font-medium mb-1">/ jour</span>
                            </div>

                            <form onSubmit={submitBooking}>
                                {/* Date Picker */}
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Dates prévues</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <i className="fa-regular fa-calendar text-gray-400"></i>
                                        </div>
                                        <input 
                                            type="text" 
                                            id="dateRangePicker" 
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" 
                                            placeholder="Sélectionner vos dates" 
                                            readOnly 
                                        />
                                    </div>
                                    {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
                                </div>

                                {/* Guests */}
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Nombre d'invités</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <i className="fa-solid fa-users text-gray-400"></i>
                                        </div>
                                        <input 
                                            type="number" 
                                            min="1" 
                                            max={venue.capacity} 
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" 
                                            value={data.guest_count} 
                                            onChange={e => setData('guest_count', e.target.value)} 
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 text-right">Max: {venue.capacity} personnes</p>
                                    {errors.guest_count && <p className="text-red-500 text-xs mt-1">{errors.guest_count}</p>}
                                </div>

                                {totalPrice > 0 && (
                                    <div className="bg-emerald-50 rounded-xl p-4 mb-6 flex justify-between items-center border border-emerald-100">
                                        <span className="font-semibold text-emerald-800">Total estimé</span>
                                        <span className="font-black text-xl text-emerald-700">{new Intl.NumberFormat('fr-FR').format(totalPrice)} FCFA</span>
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/30 transform hover:-translate-y-1"
                                >
                                    {processing ? 'Traitement...' : 'Réserver cet espace'}
                                </button>
                                
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Aucun montant ne vous sera débité pour le moment.
                                </p>
                            </form>
                        </div>
                    </div>

                </div>

                {/* Similar Venues */}
                {similarVenues && similarVenues.length > 0 && (
                    <div className="mt-12 pt-12 border-t border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Espaces similaires</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {similarVenues.map(sv => (
                                <Link key={sv.id} href={route('venues.show', sv.id)} className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
                                    <div className="h-48 overflow-hidden">
                                        <img src={sv.main_image} alt={sv.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-4">
                                        <div className="text-xs text-emerald-600 font-bold uppercase mb-1">{sv.city}</div>
                                        <h4 className="font-bold text-gray-900 line-clamp-1 mb-2">{sv.title}</h4>
                                        <div className="font-black text-gray-900">{new Intl.NumberFormat('fr-FR').format(sv.price_per_day)} FCFA <span className="font-normal text-sm text-gray-500">/ jour</span></div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
                
            </div>
        </PublicLayout>
    );
}
