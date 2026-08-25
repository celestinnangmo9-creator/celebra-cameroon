import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function VenueStats({ auth, venue, stats, bookings, blockedDates }) {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        start_date: '',
        end_date: '',
        reason: ''
    });

    const submitBlock = (e) => {
        e.preventDefault();
        post(route('venues.blockDates', venue.id), {
            preserveScroll: true,
            onSuccess: () => reset()
        });
    };

    const unblockDate = (id) => {
        if (confirm(t('venues.stats.confirm_unblock'))) {
            router.delete(route('venues.unblockDate', [venue.id, id]), {
                preserveScroll: true
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Statistiques & Calendrier: {venue.title}</h2>}
        >
            <Head title={`Statistiques - ${venue.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Statistiques Dashboard */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <i className="fa-solid fa-chart-line text-emerald-600"></i> Performances de l'annonce
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                                <div className="text-sm font-bold text-emerald-700 uppercase mb-2">Vues totales</div>
                                <div className="text-3xl font-black text-gray-900">{stats.views}</div>
                            </div>
                            <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                                <div className="text-sm font-bold text-amber-700 uppercase mb-2">Taux de réservation</div>
                                <div className="text-3xl font-black text-gray-900">{stats.booking_rate}%</div>
                                <div className="text-xs text-amber-600 mt-1">({stats.confirmed_bookings} / {stats.views})</div>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                <div className="text-sm font-bold text-blue-700 uppercase mb-2">Revenus générés</div>
                                <div className="text-3xl font-black text-gray-900">{new Intl.NumberFormat('fr-FR').format(stats.revenue)} <span className="text-lg text-gray-500 font-normal">FCFA</span></div>
                            </div>
                            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                <div className="text-sm font-bold text-purple-700 uppercase mb-2">Note Moyenne</div>
                                <div className="text-3xl font-black text-gray-900 flex items-center gap-2">
                                    {Number(stats.average_rating).toFixed(1)} <i className="fa-solid fa-star text-amber-500 text-2xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gestion du Calendrier */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Liste des indisponibilités */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <i className="fa-regular fa-calendar-xmark text-red-500"></i> Dates Indisponibles
                            </h3>
                            
                            <div className="space-y-4">
                                {blockedDates.length === 0 && bookings.length === 0 ? (
                                    <p className="text-gray-500">Aucune date bloquée ou réservée.</p>
                                ) : (
                                    <>
                                        {/* Manually Blocked Dates */}
                                        {blockedDates.map(bd => (
                                            <div key={`blocked_${bd.id}`} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                                <div>
                                                    <div className="font-bold text-gray-900">
                                                        Du {new Date(bd.start_date).toLocaleDateString()} au {new Date(bd.end_date).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-bold uppercase mr-2">Blocage Manuel</span>
                                                        {bd.reason || 'Aucun motif'}
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => unblockDate(bd.id)}
                                                    className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg font-bold text-sm transition-colors"
                                                >
                                                    Débloquer
                                                </button>
                                            </div>
                                        ))}

                                        {/* Booked Dates */}
                                        {bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').map(b => (
                                            <div key={`booking_${b.id}`} className="flex justify-between items-center p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                                <div>
                                                    <div className="font-bold text-emerald-900">
                                                        Du {new Date(b.start_date).toLocaleDateString()} au {new Date(b.end_date).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-sm text-emerald-700 mt-1">
                                                        <span className={`${b.status === 'confirmed' ? 'bg-emerald-200' : 'bg-amber-200'} text-gray-800 px-2 py-0.5 rounded text-xs font-bold uppercase mr-2`}>
                                                            Réservation ({b.status})
                                                        </span>
                                                        Client : {b.user?.name}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Bloquer de nouvelles dates */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 self-start">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Bloquer des dates</h3>
                            <form onSubmit={submitBlock} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Date de début</label>
                                    <input 
                                        type="date" 
                                        className="w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                                        value={data.start_date}
                                        onChange={e => setData('start_date', e.target.value)}
                                        required
                                    />
                                    {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Date de fin</label>
                                    <input 
                                        type="date" 
                                        className="w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                                        value={data.end_date}
                                        onChange={e => setData('end_date', e.target.value)}
                                        required
                                    />
                                    {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Motif (Optionnel)</label>
                                    <input 
                                        type="text" 
                                        className="w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                                        placeholder="Ex: Travaux, Usage personnel..."
                                        value={data.reason}
                                        onChange={e => setData('reason', e.target.value)}
                                    />
                                    {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl transition-colors mt-2"
                                >
                                    Bloquer ces dates
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
