import React from 'react';
import { Link } from '@inertiajs/react';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function BookingCard({ booking, onCancel, onReview }) {
    const { t } = useLanguage();

    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending':
            case 'accepted_awaiting_payment':
                return { color: 'bg-amber-100 text-amber-800 border-amber-200', label: t('bookings.status.pending', 'En attente') };
            case 'confirmed':
                return { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: t('bookings.status.confirmed', 'Confirmée') };
            case 'completed':
                return { color: 'bg-gray-100 text-gray-800 border-gray-200', label: t('bookings.status.completed', 'Terminée') };
            case 'cancelled':
            case 'declined':
                return { color: 'bg-red-100 text-red-800 border-red-200', label: t('bookings.status.cancelled', 'Annulée') };
            default:
                return { color: 'bg-gray-100 text-gray-800 border-gray-200', label: status };
        }
    };

    const statusConfig = getStatusConfig(booking.status);
    const mainPhoto = booking.venue?.photos?.[0]?.photo_path 
        ? `/storage/${booking.venue.photos[0].photo_path}` 
        : '/images/placeholder-venue.jpg'; // fallback
    const venueName = booking.venue?.title || t('bookings.card.venue_unavailable');
    const hostName = booking.venue?.user?.name || t('bookings.card.unknown_host');
    const isCancelable = ['pending', 'accepted_awaiting_payment'].includes(booking.status);
    const canReview = booking.status === 'completed';

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row">
            <div className="sm:w-1/3 h-48 sm:h-auto relative">
                <img src={mainPhoto} alt={venueName} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color} shadow-sm`}>
                        {statusConfig.label}
                    </span>
                </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold font-fraunces text-gray-900 dark:text-gray-100">{venueName}</h3>
                        <p className="text-lg font-semibold text-[#0B3D2E] dark:text-[#C9A227]">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(booking.total_price)}
                        </p>
                    </div>
                    
                    <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                            <i className="fa-regular fa-calendar text-[#C9A227] w-4 text-center"></i>
                            <span>
                                {new Date(booking.start_date).toLocaleDateString('fr-FR')} 
                                {booking.start_date !== booking.end_date && ` - ${new Date(booking.end_date).toLocaleDateString('fr-FR')}`}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fa-regular fa-user text-[#C9A227] w-4 text-center"></i>
                            <span>{t('bookings.card.host')} {hostName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-users text-[#C9A227] w-4 text-center"></i>
                            <span>{booking.guest_count} {t('bookings.index.guests')}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Link 
                        href={route('bookings.index')} // Temporarily link to bookings index or specific details page if exists
                        className="px-4 py-2 text-sm font-medium text-white bg-[#0B3D2E] rounded-lg hover:bg-[#124d3a] transition-colors"
                    >
                        {t('bookings.actions.view_details', 'Voir détails')}
                    </Link>

                    {isCancelable && (
                        <button 
                            onClick={() => onCancel(booking.id)}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors border border-red-200 dark:border-red-800"
                        >
                            {t('bookings.actions.cancel', 'Annuler')}
                        </button>
                    )}

                    {canReview && (
                        <button 
                            onClick={() => onReview(booking.venue_id, venueName)}
                            className="px-4 py-2 text-sm font-medium text-[#C9A227] bg-[#FAF6F0] dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors border border-[#C9A227]/30"
                        >
                            {t('bookings.actions.leave_review', 'Laisser un avis')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
