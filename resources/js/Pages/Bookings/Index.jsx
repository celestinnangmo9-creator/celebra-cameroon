import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function BookingsIndex({ auth, myBookings, receivedBookings }) {
    const [activeTab, setActiveTab] = useState('my-bookings');
    const [declineModal, setDeclineModal] = useState({ show: false, bookingId: null, reason: '' });
    const [cancelModal, setCancelModal] = useState({ show: false, bookingId: null });
    const [reviewModal, setReviewModal] = useState({ show: false, venueId: null, venueTitle: '', rating: 5, comment: '' });
    const { patch, post } = useForm();

    const handleStatusUpdate = (bookingId, status, reason = '') => {
        patch(route('bookings.updateStatus', bookingId), {
            data: { status, decline_reason: reason },
            preserveScroll: true,
            onSuccess: () => {
                setDeclineModal({ show: false, bookingId: null, reason: '' });
                setCancelModal({ show: false, bookingId: null });
            }
        });
    };

    const openDeclineModal = (id) => {
        setDeclineModal({ show: true, bookingId: id, reason: '' });
    };

    const submitReview = () => {
        post(route('reviews.store', reviewModal.venueId), {
            data: { rating: reviewModal.rating, comment: reviewModal.comment },
            preserveScroll: true,
            onSuccess: () => setReviewModal({ show: false, venueId: null, venueTitle: '', rating: 5, comment: '' })
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Suivi des Réservations</h2>}
        >
            <Head title="Mes Réservations" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            <i className="fa-solid fa-calendar-check text-emerald-600 mr-2"></i> 
                            Suivi des Réservations
                        </h1>
                        <p className="text-gray-600">Gérez vos demandes de réservation envoyées et reçues en tant qu'hôte.</p>
                    </div>

                    {/* Tabs Header */}
                    <div className="flex gap-4 border-b border-gray-200 mb-8">
                        <button 
                            onClick={() => setActiveTab('my-bookings')}
                            className={`pb-4 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'my-bookings' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            <i className="fa-solid fa-user-check"></i> 
                            Mes Réservations Effectuées ({myBookings.length})
                        </button>
                        <button 
                            onClick={() => setActiveTab('received-bookings')}
                            className={`pb-4 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'received-bookings' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            <i className="fa-solid fa-inbox"></i> 
                            Demandes Reçues sur mes Lieux ({receivedBookings.length})
                        </button>
                    </div>

                    {/* Tab 1: My Bookings */}
                    {activeTab === 'my-bookings' && (
                        <div>
                            {myBookings.length === 0 ? (
                                <div className="bg-white p-12 rounded-2xl text-center border border-gray-100 shadow-sm">
                                    <i className="fa-solid fa-calendar-xmark text-5xl text-gray-300 mb-4"></i>
                                    <h3 className="text-xl font-bold text-gray-800">Vous n'avez aucune réservation enregistrée</h3>
                                    <p className="text-gray-500 mt-2">Explorez nos salles d'exception à Douala, Yaoundé ou Kribi pour effectuer votre première réservation.</p>
                                    <Link href={route('venues.index')} className="inline-block mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors">
                                        Explorer le catalogue
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {myBookings.map(booking => (
                                        <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-center">
                                            <img 
                                                src={booking.venue.main_image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&q=80'} 
                                                alt={booking.venue.title} 
                                                className="w-full md:w-36 h-28 object-cover rounded-xl shrink-0"
                                            />
                                            <div className="grow w-full">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md">#RES-{booking.id}</span>
                                                    <h3 className="text-lg font-bold text-gray-900">{booking.venue.title}</h3>
                                                </div>
                                                <div className="text-sm text-gray-500 flex flex-wrap gap-4 mb-3">
                                                    <span className="flex items-center gap-1"><i className="fa-solid fa-location-dot"></i> {booking.venue.city}</span>
                                                    <span className="flex items-center gap-1"><i className="fa-solid fa-calendar"></i> Du {new Date(booking.start_date).toLocaleDateString()} au {new Date(booking.end_date).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1"><i className="fa-solid fa-people-group"></i> {booking.guest_count} personnes</span>
                                                </div>
                                                <div className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg inline-block">
                                                    <strong>Événement:</strong> {booking.event_type}
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-right w-full md:w-auto flex flex-col gap-3 items-end">
                                                <div className="text-xl font-extrabold text-amber-600">
                                                    {new Intl.NumberFormat('fr-FR').format(booking.total_price)} FCFA
                                                </div>
                                                    {booking.status === 'confirmed' && <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full font-bold text-xs"><i className="fa-solid fa-circle-check mr-1"></i> Confirmée</span>}
                                                    {booking.status === 'pending' && <span className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full font-bold text-xs"><i className="fa-solid fa-clock mr-1"></i> En attente</span>}
                                                    {booking.status === 'cancelled' && <span className="bg-red-100 text-red-800 px-3 py-1.5 rounded-full font-bold text-xs"><i className="fa-solid fa-circle-xmark mr-1"></i> Annulée</span>}
                                                    {booking.status !== 'confirmed' && booking.status !== 'pending' && booking.status !== 'cancelled' && (
                                                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full font-bold text-xs"><i className="fa-solid fa-flag-checkered mr-1"></i> {booking.status}</span>
                                                    )}
                                                <div className="mt-2">
                                                    {booking.payment_status === 'paid' && <span className="text-emerald-600 font-bold text-xs"><i className="fa-solid fa-check-double"></i> Payée</span>}
                                                    {booking.payment_status === 'unpaid' && <span className="text-gray-500 font-bold text-xs"><i className="fa-solid fa-hourglass-start"></i> Non payée</span>}
                                                </div>
                                                <div className="flex flex-col gap-2 w-full mt-2">
                                                    {booking.payment_status !== 'paid' && booking.status !== 'cancelled' && (
                                                        <Link 
                                                            href={route('bookings.payment', booking.id)}
                                                            className="text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <i className="fa-solid fa-credit-card"></i> Payer
                                                        </Link>
                                                    )}
                                                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                                        <button 
                                                            onClick={() => setCancelModal({ show: true, bookingId: booking.id })}
                                                            className="text-sm font-semibold text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 rounded-lg px-4 py-2 transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <i className="fa-solid fa-xmark"></i> Annuler
                                                        </button>
                                                    )}
                                                    {(booking.status === 'confirmed' || booking.status === 'completed') && (
                                                        <button 
                                                            onClick={() => setReviewModal({ show: true, venueId: booking.venue_id, venueTitle: booking.venue.title, rating: 5, comment: '' })}
                                                            className="text-sm font-semibold text-amber-600 hover:bg-amber-50 border border-amber-200 hover:border-amber-300 rounded-lg px-4 py-2 transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <i className="fa-solid fa-star"></i> Noter
                                                        </button>
                                                    )}
                                                    <Link 
                                                        href={route('messages.index', { contact: booking.venue.user_id, venue_id: booking.venue_id })} 
                                                        className="text-sm font-semibold text-gray-600 hover:text-emerald-600 border border-gray-300 hover:border-emerald-600 rounded-lg px-4 py-2 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <i className="fa-solid fa-comments"></i> Message
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 2: Received Bookings */}
                    {activeTab === 'received-bookings' && (
                        <div>
                            {receivedBookings.length === 0 ? (
                                <div className="bg-white p-12 rounded-2xl text-center border border-gray-100 shadow-sm">
                                    <i className="fa-solid fa-inbox text-5xl text-gray-300 mb-4"></i>
                                    <h3 className="text-xl font-bold text-gray-800">Aucune demande de réservation reçue</h3>
                                    <p className="text-gray-500 mt-2">Publiez de nouveaux lieux ou ajustez vos tarifs pour recevoir des demandes.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {receivedBookings.map(booking => (
                                        <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-center">
                                            <div className="grow w-full">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md">#RES-{booking.id}</span>
                                                    <h3 className="text-lg font-bold text-gray-900">Demande de {booking.user.name}</h3>
                                                </div>
                                                <div className="text-sm font-bold text-emerald-600 mb-2">
                                                    Lieu: {booking.venue.title} ({booking.venue.city})
                                                </div>
                                                <div className="text-sm text-gray-500 flex flex-wrap gap-4 mb-3">
                                                    <span className="flex items-center gap-1"><i className="fa-solid fa-calendar"></i> Du {new Date(booking.start_date).toLocaleDateString()} au {new Date(booking.end_date).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1"><i className="fa-solid fa-users"></i> {booking.guest_count} invités</span>
                                                    <span className="flex items-center gap-1"><i className="fa-solid fa-champagne-glasses"></i> {booking.event_type}</span>
                                                </div>
                                                {booking.special_requests && (
                                                    <div className="text-sm bg-gray-50 p-3 rounded-lg mt-2 text-gray-700 border border-gray-100">
                                                        <strong>Remarque client:</strong> "{booking.special_requests}"
                                                    </div>
                                                )}
                                            </div>
                                            <div className="shrink-0 text-right w-full md:w-auto flex flex-col gap-4 items-end">
                                                <div className="text-xl font-extrabold text-amber-600">
                                                    {new Intl.NumberFormat('fr-FR').format(booking.total_price)} FCFA
                                                </div>
                                                
                                                {booking.status === 'pending' ? (
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-2"
                                                        >
                                                            <i className="fa-solid fa-check"></i> Accepter
                                                        </button>
                                                        <button 
                                                            onClick={() => openDeclineModal(booking.id)}
                                                            className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-2"
                                                        >
                                                            <i className="fa-solid fa-xmark"></i> Refuser
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                                                        Statut actuel: {booking.status === 'confirmed' ? 'Confirmée' : booking.status === 'declined' ? 'Refusée' : booking.status === 'cancelled' ? 'Annulée' : booking.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Decline Modal */}
            {declineModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Refuser la réservation</h3>
                        <p className="text-sm text-gray-500 mb-4">Veuillez indiquer le motif du refus (optionnel). Ce message sera envoyé au client.</p>
                        <textarea 
                            className="w-full border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-xl mb-4"
                            rows="3"
                            placeholder="Motif du refus..."
                            value={declineModal.reason}
                            onChange={(e) => setDeclineModal({ ...declineModal, reason: e.target.value })}
                        ></textarea>
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={() => setDeclineModal({ show: false, bookingId: null, reason: '' })}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={() => handleStatusUpdate(declineModal.bookingId, 'declined', declineModal.reason)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                            >
                                Confirmer le refus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {cancelModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Annuler la réservation</h3>
                        <p className="text-sm text-gray-500 mb-6">Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.</p>
                        
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={() => setCancelModal({ show: false, bookingId: null })}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Retour
                            </button>
                            <button 
                                onClick={() => handleStatusUpdate(cancelModal.bookingId, 'cancelled')}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                            >
                                Oui, annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {reviewModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Évaluer votre expérience</h3>
                        <p className="text-sm text-gray-500 mb-6">Lieu : {reviewModal.venueTitle}</p>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Note globale</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button 
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewModal({ ...reviewModal, rating: star })}
                                        className="text-3xl focus:outline-none"
                                    >
                                        <i className={`fa-star ${star <= reviewModal.rating ? 'fa-solid text-amber-500' : 'fa-regular text-gray-300'} hover:scale-110 transition-transform`}></i>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Votre avis (Optionnel)</label>
                            <textarea 
                                className="w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                                rows="4"
                                placeholder="Partagez votre expérience..."
                                value={reviewModal.comment}
                                onChange={(e) => setReviewModal({ ...reviewModal, comment: e.target.value })}
                            ></textarea>
                        </div>
                        
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={() => setReviewModal({ show: false, venueId: null, venueTitle: '', rating: 5, comment: '' })}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={submitReview}
                                disabled={reviewModal.rating === 0 || !reviewModal.comment.trim()}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
                            >
                                <i className="fa-solid fa-paper-plane"></i> Publier l'avis
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
