import { Head, Link, usePage, router, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState } from 'react';
import BookingCalendar from '@/Components/BookingCalendar';
import VenueAvailabilityCalendar from '@/Components/VenueAvailabilityCalendar';
import { useLanguage } from '../../Contexts/LanguageContext';

export default function VenueShow({ venue, similarVenues, bookedDates }) {
    const { t } = useLanguage();
    const { auth } = usePage().props;
    const user = auth?.user;
    const favoriteVenueIds = auth?.favorite_venue_ids || [];
    const { post: togglePost } = useForm();
    
    const [mainImage, setMainImage] = useState(venue.main_image);
    const [showHostPhotoModal, setShowHostPhotoModal] = useState(false);
    
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
                                <span className="text-gray-400 font-medium">{t('venues.show.no_more_photos')}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative pb-20">
                    
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 flex flex-col">
                        {/* Title & Badges */}
                        <div className="mb-8 border-b border-gray-100 pb-8 flex justify-between items-start order-1">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-[#0B3D2E] mb-4 tracking-tight leading-tight font-['Fraunces']">
                                    {venue.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 text-gray-700 font-medium text-sm">
                                    <span className="flex items-center gap-2 bg-[#FAF6F0] text-[#0B3D2E] px-4 py-2 rounded-xl border border-emerald-100 font-bold uppercase tracking-wider">
                                        <i className="fa-solid fa-tag text-[#C9A227]"></i> {venue.category}
                                    </span>
                                    <span className="flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 font-bold">
                                        <i className="fa-solid fa-location-dot text-emerald-600"></i> {venue.city}, {venue.district}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={toggleFavorite}
                                className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-md border-2 ${favoriteVenueIds.includes(venue.id) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 hover:scale-110'}`}
                                title={t('venues.index.add_favorite')}
                            >
                                <i className={`${favoriteVenueIds.includes(venue.id) ? 'fa-solid' : 'fa-regular'} fa-heart text-2xl`}></i>
                            </button>
                        </div>

                        {/* Description */}
                        <div className="mb-10 bg-[#FAF6F0] p-8 rounded-3xl border border-emerald-100/60 shadow-sm relative overflow-hidden order-3 md:order-2">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-bl-full opacity-30 pointer-events-none"></div>
                            <h2 className="text-2xl font-black text-[#0B3D2E] mb-4 font-['Fraunces']">{t('venues.show.about_this_place')}</h2>
                            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line break-words font-medium relative z-10">
                                {venue.description}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div className="mb-10 order-4 md:order-3">
                            <h2 className="text-2xl font-black text-[#0B3D2E] mb-6 font-['Fraunces']">{t('venues.show.what_it_offers')}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                                        <i className="fa-solid fa-users"></i>
                                    </div>
                                    <span className="font-bold text-gray-800 text-lg">{t('venues.show.capacity_of')} {venue.capacity} {t('venues.show.people')}</span>
                                </div>
                                <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                                        <i className="fa-solid fa-bolt"></i>
                                    </div>
                                    <span className="font-bold text-gray-800 text-lg">{t('venues.show.generator')}</span>
                                </div>
                                <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                                        <i className="fa-solid fa-wind"></i>
                                    </div>
                                    <span className="font-bold text-gray-800 text-lg">{t('venues.show.ac')}</span>
                                </div>
                                <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                                        <i className="fa-solid fa-square-parking"></i>
                                    </div>
                                    <span className="font-bold text-gray-800 text-lg">{t('venues.show.parking')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Host Info */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 mb-6 sm:mb-10 bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden order-2 md:order-4">
                            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-bl from-emerald-100 to-transparent rounded-bl-full -z-0 opacity-50 pointer-events-none"></div>
                            
                            <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
                                <div 
                                    className="w-12 h-12 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#0B3D2E] to-emerald-700 flex items-center justify-center text-white text-xl sm:text-4xl font-black shadow-md relative z-10 border-2 sm:border-4 border-white overflow-hidden shrink-0 cursor-pointer hover:scale-105 transition-transform"
                                    onClick={() => venue.user?.avatar && setShowHostPhotoModal(true)}
                                >
                                {venue.user?.avatar ? (
                                    <img src={venue.user.avatar.startsWith('http') || venue.user.avatar.startsWith('/') ? venue.user.avatar : `/storage/${venue.user.avatar}`} alt={venue.user.name} className="w-full h-full object-cover" />
                                ) : (
                                    venue.user?.name?.charAt(0)
                                )}
                                </div>
                                <div className="relative z-10 text-left flex-1">
                                    <h3 className="text-base sm:text-xl font-black text-gray-900 mb-0 sm:mb-1 leading-tight">{t('venues.show.host')} <span className="text-[#0B3D2E]">{venue.user?.name}</span></h3>
                                    <p className="text-gray-500 font-bold text-xs sm:text-sm flex items-center gap-1.5 mt-1 sm:mt-0">
                                        <i className="fa-solid fa-calendar-check text-[#C9A227]"></i> 
                                        {t('venues.show.member_since')} {new Date(venue.user?.created_at).getFullYear()}
                                    </p>
                                </div>
                            </div>
                            <div className="relative z-10 w-full sm:w-auto mt-1 sm:mt-0">
                                {(!user || user.id !== venue.user_id) && (
                                    user ? (
                                        <Link href={route('messages.index', { contact: venue.user_id, venue_id: venue.id })} className="w-full sm:w-auto inline-flex items-center justify-center bg-[#0B3D2E] hover:bg-emerald-900 text-white font-bold py-2.5 px-4 sm:py-3 sm:px-8 rounded-xl shadow-md sm:shadow-lg shadow-emerald-900/30 transition-transform transform hover:-translate-y-1 text-sm sm:text-base">
                                            <i className="fa-solid fa-comment-dots mr-2 text-[#C9A227]"></i> {t('venues.show.contact_host')}
                                        </Link>
                                    ) : (
                                        <button onClick={() => window.location.href = route('login')} className="w-full sm:w-auto inline-flex items-center justify-center bg-[#0B3D2E] hover:bg-emerald-900 text-white font-bold py-2.5 px-4 sm:py-3 sm:px-8 rounded-xl shadow-md sm:shadow-lg shadow-emerald-900/30 transition-transform transform hover:-translate-y-1 text-sm sm:text-base">
                                            <i className="fa-solid fa-comment-dots mr-2 text-[#C9A227]"></i> {t('venues.show.contact_host')}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Availability Calendar (New Section) */}
                        <div className="mb-10 order-5">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('venues.show.availabilities')}</h2>
                            <p className="text-gray-600 text-lg mb-8">{t('venues.show.availabilities_desc')}</p>
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('venues.show.reviews')} ({venue.reviews?.length || 0})</h2>
                    {venue.reviews && venue.reviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {venue.reviews.map(review => (
                                <div key={review.id} className="bg-gray-50 p-6 rounded-2xl">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 overflow-hidden">
                                            {review.user?.avatar ? (
                                                <img src={review.user.avatar.startsWith('http') || review.user.avatar.startsWith('/') ? review.user.avatar : `/storage/${review.user.avatar}`} alt={review.user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                review.user?.name?.charAt(0)
                                            )}
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
                                            <h5 className="text-sm font-bold text-emerald-700 mb-1"><i className="fa-solid fa-reply"></i> {t('venues.show.host_reply')}</h5>
                                            <p className="text-sm text-gray-600 break-words">{review.owner_reply}</p>
                                        </div>
                                    ) : (
                                        user && user.id === venue.user_id && (
                                            <form onSubmit={(e) => submitReply(e, review.id)} className="mt-4">
                                                <textarea 
                                                    className="w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl text-sm"
                                                    rows="2"
                                                    placeholder={t('venues.show.your_reply')}
                                                    id={`reply_${review.id}`}
                                                ></textarea>
                                                <button type="submit" className="mt-2 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700">
                                                    {t('venues.show.publish_reply')}
                                                </button>
                                            </form>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">{t('venues.show.no_reviews')}</p>
                    )}
                </div>

                {/* Similar Venues */}
                {similarVenues && similarVenues.length > 0 && (
                    <div className="mt-12 pt-12 border-t border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('venues.show.similar_venues')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {similarVenues.map(sv => (
                                <Link key={sv.id} href={route('venues.show', sv.id)} className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
                                    <div className="h-48 overflow-hidden">
                                        <img src={sv.main_image} alt={sv.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-4">
                                        <div className="text-xs text-emerald-600 font-bold uppercase mb-1">{sv.city}</div>
                                        <h4 className="font-bold text-gray-900 line-clamp-1 mb-2">{sv.title}</h4>
                                        <div className="font-black text-gray-900">{new Intl.NumberFormat('fr-FR').format(sv.price_per_day)} FCFA <span className="font-normal text-sm text-gray-500">{t('venues.show.per_day')}</span></div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
                
            </div>

            {/* Host Photo Modal */}
            {showHostPhotoModal && venue.user?.avatar && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={() => setShowHostPhotoModal(false)}>
                    <div className="relative max-w-2xl max-h-screen flex flex-col items-center">
                        <button className="absolute -top-12 right-0 text-white/70 hover:text-white text-3xl transition-colors" onClick={() => setShowHostPhotoModal(false)}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <img 
                            src={venue.user.avatar.startsWith('http') || venue.user.avatar.startsWith('/') ? venue.user.avatar : `/storage/${venue.user.avatar}`} 
                            alt={venue.user.name} 
                            className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl" 
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="text-white mt-4 font-medium text-lg bg-black/50 px-6 py-2 rounded-full backdrop-blur-md">
                            {venue.user.name}
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
