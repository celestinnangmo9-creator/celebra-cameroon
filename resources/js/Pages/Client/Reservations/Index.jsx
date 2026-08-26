import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useLanguage } from '@/Contexts/LanguageContext';
import BookingCard from '@/Components/BookingCard';

export default function ReservationsIndex({ auth, bookings, activeTab }) {
    const { t } = useLanguage();
    const [cancelModal, setCancelModal] = useState({ show: false, bookingId: null, reason: '' });
    const [reviewModal, setReviewModal] = useState({ show: false, venueId: null, venueTitle: '', rating: 5, comment: '' });
    
    const { patch: patchCancel, processing: cancelProcessing, reset: resetCancel } = useForm({
        status: 'cancelled',
        decline_reason: ''
    });

    const { post: postReview, processing: reviewProcessing, reset: resetReview, data: reviewData, setData: setReviewData } = useForm({
        rating: 5,
        comment: ''
    });

    const handleTabChange = (tab) => {
        router.get(route('client.reservations.index'), { tab }, {
            preserveState: true,
            preserveScroll: true,
            only: ['bookings', 'activeTab']
        });
    };

    const confirmCancel = (e) => {
        e.preventDefault();
        patchCancel(route('bookings.updateStatus', cancelModal.bookingId), {
            preserveScroll: true,
            onSuccess: () => {
                setCancelModal({ show: false, bookingId: null, reason: '' });
                resetCancel();
            }
        });
    };

    const submitReview = (e) => {
        e.preventDefault();
        postReview(route('reviews.store', reviewModal.venueId), {
            preserveScroll: true,
            onSuccess: () => {
                setReviewModal({ show: false, venueId: null, venueTitle: '', rating: 5, comment: '' });
                resetReview();
            }
        });
    };

    const tabs = [
        { id: 'upcoming', label: t('bookings.tabs.upcoming', 'À venir') },
        { id: 'past', label: t('bookings.tabs.past', 'Passées') },
        { id: 'cancelled', label: t('bookings.tabs.cancelled', 'Annulées') },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl font-fraunces text-gray-800 dark:text-gray-200 leading-tight">{t('nav.bookings')}</h2>}
        >
            <Head title={`${t('nav.bookings')} - Celebra Cameroon`} />

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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {bookings.data.map(booking => (
                                <BookingCard 
                                    key={booking.id} 
                                    booking={booking}
                                    onCancel={(id) => setCancelModal({ show: true, bookingId: id, reason: '' })}
                                    onReview={(venueId, venueTitle) => {
                                        setReviewModal({ show: true, venueId, venueTitle, rating: 5, comment: '' });
                                        setReviewData('rating', 5);
                                        setReviewData('comment', '');
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                            <div className="w-24 h-24 bg-emerald-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="fa-regular fa-calendar-xmark text-4xl text-[#0B3D2E] dark:text-[#C9A227]"></i>
                            </div>
                            <h3 className="text-xl font-fraunces font-bold text-gray-900 dark:text-gray-100 mb-2">
                                {activeTab === 'upcoming' ? t('bookings.index.no_upcoming_bookings') : activeTab === 'past' ? t('bookings.index.no_past_bookings') : t('bookings.index.no_cancelled_bookings')}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                {t('bookings.index.no_requests_in_category')}
                            </p>
                            <Link
                                href={route('venues.index')}
                                className="inline-flex items-center px-6 py-3 bg-[#0B3D2E] text-white font-medium rounded-xl hover:bg-[#124d3a] transition-all shadow-md hover:shadow-lg gap-2"
                            >
                                <i className="fa-solid fa-magnifying-glass"></i>
                                {t('bookings.index.discover_venues')}
                            </Link>
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

            {/* Cancel Modal */}
            {cancelModal.show && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setCancelModal({ show: false, bookingId: null, reason: '' })}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={confirmCancel}>
                                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <i className="fa-solid fa-triangle-exclamation text-red-600"></i>
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                                                {t('bookings.index.cancel_modal_title')}
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t('bookings.index.cancel_modal_desc')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button 
                                        type="submit" 
                                        disabled={cancelProcessing}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                    >
                                        {t('bookings.index.cancel_btn')}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setCancelModal({ show: false, bookingId: null, reason: '' })}
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

            {/* Review Modal */}
            {reviewModal.show && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setReviewModal({ show: false, venueId: null, venueTitle: '', rating: 5, comment: '' })}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={submitReview}>
                                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4" id="modal-title">
                                        {t('bookings.index.rate_title')} {reviewModal.venueTitle}
                                    </h3>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('bookings.index.rating')}</label>
                                        <div className="flex gap-2 text-2xl text-gray-300">
                                            {[1,2,3,4,5].map(star => (
                                                <button 
                                                    key={star} 
                                                    type="button"
                                                    onClick={() => setReviewData('rating', star)}
                                                    className={`hover:scale-110 transition-transform ${reviewData.rating >= star ? 'text-[#C9A227]' : ''}`}
                                                >
                                                    <i className="fa-solid fa-star"></i>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('bookings.index.review_desc')}</label>
                                        <textarea 
                                            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                                            rows="4"
                                            placeholder={t('bookings.index.review_placeholder')}
                                            value={reviewData.comment}
                                            onChange={e => setReviewData('comment', e.target.value)}
                                            style={{ fontSize: '16px' }} // prevent iOS zoom
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button 
                                        type="submit" 
                                        disabled={reviewProcessing}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#0B3D2E] text-base font-medium text-white hover:bg-[#124d3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B3D2E] sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                    >
                                        {t('bookings.index.publish_review')}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setReviewModal({ show: false, venueId: null, venueTitle: '', rating: 5, comment: '' })}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {t('bookings.index.cancel')}
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
