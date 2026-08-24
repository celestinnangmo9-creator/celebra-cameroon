import { Head, Link, usePage, router, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState } from 'react';
import BookingCalendar from '@/Components/BookingCalendar';
import VenueAvailabilityCalendar from '@/Components/VenueAvailabilityCalendar';

export default function VenueShow({ venue, similarVenues, bookedDates }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const favoriteVenueIds = auth?.favorite_venue_ids || [];
    const { post: togglePost } = useForm();
    
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

    const submitReply = (e, reviewId) => {
        e.preventDefault();
        const replyText = document.getElementById(`reply_${reviewId}`).value;
        if (!replyText) return;
        
        router.post(route('reviews.reply', reviewId), { reply: replyText }, {
            preserveScroll: true,
            onSuccess: () => {
                const input = document.getElementById(`reply_${reviewId}`);
                if (input) input.value = '';
            }
        });
    };

    const toggleFavorite = () => {
        if (!user) {
            window.location.href = route('login');
            return;
        }
        togglePost(route('favorites.toggle', venue.id), { preserveScroll: true });
    };

    return (
        <PublicLayout>
            <Head title={`${venue.title} - Celebra Cameroon`} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Premium Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 h-auto md:h-[31.25rem] rounded-3xl overflow-hidden shadow-sm">
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
                        <div className="mb-8 border-b border-gray-100 pb-8 flex justify-between items-start">
                            <div>
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
                            <button 
                                onClick={toggleFavorite}
                                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm border ${favoriteVenueIds.includes(venue.id) ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50'}`}
                                title="Ajouter aux favoris"
                            >
                                <i className={`${favoriteVenueIds.includes(venue.id) ? 'fa-solid' : 'fa-regular'} fa-heart text-xl`}></i>
                            </button>
                        </div>

                        {/* Description */}
                        <div className="mb-10 border-b border-gray-100 pb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos de ce lieu</h2>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line break-words">
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
                        <div className="flex items-center gap-6 mb-10 border-b border-gray-100 pb-10">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl font-bold">
                                {venue.user?.name?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Hôte : {venue.user?.name}</h3>
                                <p className="text-gray-500">Membre depuis {new Date(venue.user?.created_at).getFullYear()}</p>
                            </div>
                            {(!user || user.id !== venue.user_id) && (
                                user ? (
                                    <Link href={route('messages.index', { contact: venue.user_id, venue_id: venue.id })} className="ml-auto btn btn-outline">
                                        <i className="fa-solid fa-comment-dots mr-2"></i> Contacter l'hôte
                                    </Link>
                                ) : (
                                    <button onClick={() => window.location.href = route('login')} className="ml-auto btn btn-outline">
                                        <i className="fa-solid fa-comment-dots mr-2"></i> Contacter l'hôte
                                    </button>
                                )
                            )}
                        </div>

                        {/* Availability Calendar (New Section) */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disponibilités</h2>
                            <p className="text-gray-600 text-lg mb-8">Consultez les dates libres et celles déjà réservées avant de formuler votre demande de réservation dans le formulaire.</p>
                            <VenueAvailabilityCalendar unavailableDates={bookedDates} />
                        </div>
                    </div>

                    {/* Right Column: Booking Widget */}
                    <div className="lg:col-span-1">
                        <BookingCalendar venue={venue} initialBookedDates={bookedDates} />
                    </div>

                </div>

                {/* Reviews Section */}
                <div className="mt-12 pt-12 border-t border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Avis des clients ({venue.reviews?.length || 0})</h2>
                    {venue.reviews && venue.reviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {venue.reviews.map(review => (
                                <div key={review.id} className="bg-gray-50 p-6 rounded-2xl">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                                            {review.user?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{review.user?.name}</h4>
                                            <div className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</div>
                                        </div>
                                        <div className="ml-auto text-amber-500 font-bold">
                                            <i className="fa-solid fa-star"></i> {review.rating}/5
                                        </div>
                                    </div>
                                    <p className="text-gray-700 italic mb-4 break-words">"{review.comment}"</p>
                                    
                                    {review.owner_reply ? (
                                        <div className="bg-white p-4 rounded-xl border border-emerald-100 ml-4 relative mt-4">
                                            <div className="absolute -left-3 top-4 w-3 h-3 bg-white border-l border-b border-emerald-100 rotate-45"></div>
                                            <h5 className="text-sm font-bold text-emerald-700 mb-1"><i className="fa-solid fa-reply"></i> Réponse de l'hôte</h5>
                                            <p className="text-sm text-gray-600 break-words">{review.owner_reply}</p>
                                        </div>
                                    ) : (
                                        user && user.id === venue.user_id && (
                                            <form onSubmit={(e) => submitReply(e, review.id)} className="mt-4">
                                                <textarea 
                                                    className="w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl text-sm"
                                                    rows="2"
                                                    placeholder="Votre réponse à cet avis..."
                                                    id={`reply_${review.id}`}
                                                ></textarea>
                                                <button type="submit" className="mt-2 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700">
                                                    Publier la réponse
                                                </button>
                                            </form>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Aucun avis pour le moment.</p>
                    )}
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
