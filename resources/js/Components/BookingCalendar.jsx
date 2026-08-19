import React, { useState, useEffect, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { French } from 'flatpickr/dist/l10n/fr.js';

export default function BookingCalendar({ venue, initialBookedDates }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const datePickerRef = useRef(null);

    const [bookedDates, setBookedDates] = useState(initialBookedDates || []);
    const [totalPrice, setTotalPrice] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        venue_id: venue.id,
        start_date: '',
        end_date: '',
        guest_count: 1,
        event_type: 'Fête',
        special_requests: ''
    });

    // Fetch availability in real-time on mount
    useEffect(() => {
        fetch(`/venues/${venue.id}/availability`)
            .then(res => res.json())
            .then(result => {
                if (result.unavailable_dates) {
                    setBookedDates(result.unavailable_dates);
                }
            })
            .catch(err => console.error("Could not fetch availability", err));
    }, [venue.id]);

    useEffect(() => {
        if (!datePickerRef.current) return;
        
        const fp = flatpickr(datePickerRef.current, {
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
        
        return () => {
            if (Array.isArray(fp)) {
                fp.forEach(instance => {
                    if (instance && typeof instance.destroy === 'function') {
                        instance.destroy();
                    }
                });
            } else if (fp && typeof fp.destroy === 'function') {
                fp.destroy();
            }
        };
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
        <div className="sticky top-24 bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
            <div className="mb-6 flex items-end gap-2 border-b border-gray-100 pb-6">
                <span className="text-3xl font-black text-gray-900">{new Intl.NumberFormat('fr-FR').format(venue.price_per_day)} FCFA</span>
                <span className="text-gray-500 font-medium mb-1">/ jour</span>
            </div>

            {user && user.id === venue.user_id ? (
                <div className="text-center py-6">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-crown text-amber-500 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">C'est votre espace</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Vous ne pouvez pas réserver votre propre salle. Accédez au tableau de bord pour gérer vos disponibilités.
                    </p>
                    <a href={route('dashboard')} className="btn bg-amber-500 hover:bg-amber-600 text-white w-full rounded-xl py-3 block text-center font-bold shadow-lg shadow-amber-500/30">
                        Aller au tableau de bord
                    </a>
                </div>
            ) : (
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
                                ref={datePickerRef}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" 
                                placeholder="Sélectionner vos dates" 
                                readOnly 
                            />
                        </div>
                        {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
                    </div>

                    {/* Event Type */}
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Type d'événement</label>
                        <select 
                            className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            value={data.event_type}
                            onChange={e => setData('event_type', e.target.value)}
                        >
                            <option value="Fête">Fête / Célébration</option>
                            <option value="Mariage">Mariage</option>
                            <option value="Conférence">Conférence / Réunion</option>
                            <option value="Shooting">Shooting Photo/Vidéo</option>
                            <option value="Autre">Autre</option>
                        </select>
                        {errors.event_type && <p className="text-red-500 text-xs mt-1">{errors.event_type}</p>}
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

                    {/* Special requests */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Demandes spéciales (Optionnel)</label>
                        <textarea 
                            className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                            rows="2"
                            placeholder="Ex: Besoin d'un traiteur, chaises supplémentaires..."
                            value={data.special_requests}
                            onChange={e => setData('special_requests', e.target.value)}
                        ></textarea>
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
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/30 transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                        {processing ? 'Traitement...' : 'Réserver cet espace'}
                    </button>
                    
                    <p className="text-center text-xs text-gray-400 mt-4">
                        Aucun montant ne vous sera débité pour le moment.
                    </p>
                </form>
            )}
        </div>
    );
}
