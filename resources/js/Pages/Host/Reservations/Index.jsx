import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function HostReservationsIndex({ auth, bookings, activeTab }) {
    const { t } = useLanguage();
    
    const [declineModal, setDeclineModal] = useState({ show: false, bookingId: null, reason: '' });
    
    const { post: postAccept, processing: acceptProcessing } = useForm({
        host_message: ''
    });

    const { post: postDecline, processing: declineProcessing, reset: resetDecline, data: declineData, setData: setDeclineData } = useForm({
        decline_reason: ''
    });

    const handleTabChange = (tab) => {
        router.get(route('host.reservations.index'), { tab }, {
            preserveState: true,
            preserveScroll: true,
            only: ['bookings', 'activeTab']
        });
    };

    const handleAccept = (id) => {
        postAccept(route('host.reservations.accept', id), {
            preserveScroll: true,
        });
    };

    const confirmDecline = (e) => {
        e.preventDefault();
        postDecline(route('host.reservations.decline', declineModal.bookingId), {
            preserveScroll: true,
            onSuccess: () => {
                setDeclineModal({ show: false, bookingId: null });
                resetDecline();
            }
        });
    };

    const tabs = [
        { id: 'pending', label: t('bookings.index.status_pending') },
        { id: 'confirmed', label: t('bookings.index.status_confirmed') },
        { id: 'history', label: t('bookings.index.tab_history') },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">{t('bookings.index.status_pending')}</span>;
            case 'accepted_awaiting_payment':
                return <span className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold">{t('bookings.index.status_awaiting_payment')}</span>;
            case 'confirmed':
                return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">{t('bookings.index.status_confirmed')}</span>;
            case 'completed':
                return <span className="bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1 rounded-full text-xs font-bold">{t('bookings.index.status_paid')}</span>;
            case 'cancelled':
            case 'declined':
                return <span className="bg-red-100 text-red-800 border border-red-200 px-3 py-1 rounded-full text-xs font-bold">{status === 'cancelled' ? t('bookings.index.status_cancelled') : t('bookings.index.status_declined')}</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl font-fraunces text-gray-800 dark:text-gray-200 leading-tight">{t('nav.bookings')}</h2>}
        >
            <Head title={`${t('nav.bookings')} - Prestataire`} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`
                                        whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                                        ${activeTab === tab.id
                                            ? 'border-[#0B3D2E] text-[#0B3D2E] dark:border-[#C9A227] dark:text-[#C9A227]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                        }
                                    `}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    {bookings.data.length > 0 ? (
                        <div className="flex flex-col gap-6">
                            {bookings.data.map(booking => (
                                <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-center">
                                    <div className="w-full md:w-36 h-28 shrink-0 relative rounded-xl overflow-hidden">
                                        <img 
                                            src={booking.venue?.main_image || '/images/placeholder-venue.jpg'} 
                                            alt={booking.venue?.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="grow w-full">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded-md">#RES-{booking.id}</span>
                                            <h3 className="text-lg font-bold font-fraunces text-gray-900 dark:text-gray-100">{booking.venue?.title}</h3>
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-wrap gap-4 mb-3">
                                            <span className="flex items-center gap-1"><i className="fa-solid fa-user text-[#C9A227]"></i> Client: {booking.user?.name}</span>
                                            <span className="flex items-center gap-1"><i className="fa-solid fa-calendar text-[#C9A227]"></i> {new Date(booking.start_date).toLocaleDateString()} {booking.start_date !== booking.end_date && `- ${new Date(booking.end_date).toLocaleDateString()}`}</span>
                                            <span className="flex items-center gap-1"><i className="fa-solid fa-people-group text-[#C9A227]"></i> {booking.guest_count} {t('bookings.index.guests')}</span>
                                        </div>
                                        <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg inline-block">
                                            <strong>{t('bookings.index.event')}</strong> {booking.event_type}
                                        </div>
                                    </div>
                                    <div className="shrink-0 text-right w-full md:w-auto flex flex-col gap-3 items-end">
                                        <div className="text-xl font-extrabold text-[#0B3D2E] dark:text-[#C9A227]">
                                            {new Intl.NumberFormat('fr-FR').format(booking.total_price)} FCFA
                                        </div>
                                        <div>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 justify-end mt-2">
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleAccept(booking.id)}
                                                        disabled={acceptProcessing}
                                                        className="text-sm font-semibold bg-[#0B3D2E] hover:bg-[#124d3a] text-white rounded-lg px-4 py-2 transition-colors disabled:opacity-50 shadow-sm"
                                                    >
                                                        <i className="fa-solid fa-check mr-1"></i> {t('bookings.index.accept')}
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setDeclineModal({ show: true, bookingId: booking.id });
                                                            setDeclineData('decline_reason', '');
                                                        }}
                                                        className="text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2 transition-colors"
                                                    >
                                                        <i className="fa-solid fa-xmark mr-1"></i> {t('bookings.index.decline')}
                                                    </button>
                                                </>
                                            )}
                                            
                                            {(booking.status === 'confirmed' || booking.status === 'accepted_awaiting_payment') && (
                                                <Link 
                                                    href={route('messages.index')}
                                                    className="text-sm font-semibold text-[#0B3D2E] dark:text-[#C9A227] hover:bg-emerald-50 dark:hover:bg-gray-700 border border-emerald-200 dark:border-gray-600 rounded-lg px-4 py-2 transition-colors"
                                                >
                                                    <i className="fa-solid fa-comment-dots mr-1"></i> {t('bookings.index.contact')}
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                            <div className="w-24 h-24 bg-emerald-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="fa-solid fa-inbox text-4xl text-[#0B3D2E] dark:text-[#C9A227]"></i>
                            </div>
                            <h3 className="text-xl font-fraunces font-bold text-gray-900 dark:text-gray-100 mb-2">
                                {activeTab === 'pending' ? t('bookings.index.no_pending_requests') : activeTab === 'confirmed' ? t('bookings.index.no_confirmed_requests') : t('bookings.index.no_history_requests')}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                {t('bookings.index.no_requests_in_category')}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {bookings.links && bookings.links.length > 3 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex space-x-1">
                                {bookings.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                            link.active 
                                                ? 'bg-[#0B3D2E] text-white font-bold' 
                                                : link.url 
                                                    ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700' 
                                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Decline Modal */}
            {declineModal.show && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setDeclineModal({ show: false, bookingId: null })}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={confirmDecline}>
                                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <i className="fa-solid fa-triangle-exclamation text-red-600"></i>
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                                                {t('bookings.index.decline_modal_title')}
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                    {t('bookings.index.decline_modal_desc')}
                                                </p>
                                                <textarea 
                                                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                                                    rows="3"
                                                    placeholder={t('bookings.index.decline_modal_placeholder')}
                                                    value={declineData.decline_reason}
                                                    onChange={e => setDeclineData('decline_reason', e.target.value)}
                                                    style={{ fontSize: '16px' }} // prevent iOS zoom
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button 
                                        type="submit" 
                                        disabled={declineProcessing}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                    >
                                        {t('bookings.index.decline_btn')}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setDeclineModal({ show: false, bookingId: null })}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {t('bookings.index.back')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
