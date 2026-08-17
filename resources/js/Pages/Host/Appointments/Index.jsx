import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { CalendarIcon, MapPinIcon, ClockIcon, UserIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function AppointmentsIndex({ auth, appointments, filters }) {
    const [currentTab, setCurrentTab] = useState(filters.status || 'pending');

    const handleTabChange = (status) => {
        setCurrentTab(status);
        router.get(route('host.appointments.index'), { status }, { preserveState: true, replace: true });
    };

    const updateStatus = (id, newStatus) => {
        if (confirm(`Êtes-vous sûr de vouloir ${newStatus === 'confirmed' ? 'confirmer' : 'refuser'} ce rendez-vous ?`)) {
            router.patch(route('appointments.updateStatus', id), { status: newStatus }, {
                preserveScroll: true,
            });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">En attente</span>;
            case 'confirmed': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">Confirmé</span>;
            case 'refused': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Refusé</span>;
            case 'cancelled': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Annulé</span>;
            case 'completed': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Terminé</span>;
            default: return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion des Rendez-vous</h2>}
        >
            <Head title="Mes Rendez-vous" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Tabs */}
                    <div className="mb-6 flex space-x-4 border-b border-gray-200">
                        {['pending', 'confirmed', 'completed', 'refused'].map((status) => (
                            <button
                                key={status}
                                onClick={() => handleTabChange(status)}
                                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                                    currentTab === status
                                        ? 'border-emerald-600 text-emerald-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {status === 'pending' ? 'En attente' : 
                                 status === 'confirmed' ? 'Confirmés' : 
                                 status === 'completed' ? 'Passés' : 'Refusés'}
                            </button>
                        ))}
                    </div>

                    {appointments.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center text-gray-500">
                            Aucun rendez-vous trouvé dans cette catégorie.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {appointments.map((appointment) => (
                                <div key={appointment.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        {getStatusBadge(appointment.status)}
                                        <div className="text-sm text-gray-500 font-medium">
                                            {appointment.type === 'physical_visit' ? 'Visite' : 'Appel Vidéo'}
                                        </div>
                                    </div>
                                    
                                    <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">
                                        <Link href={route('venues.show', appointment.venue.id)} className="hover:text-emerald-600 transition-colors">
                                            {appointment.venue.title}
                                        </Link>
                                    </h3>

                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center">
                                            <CalendarIcon className="h-4 w-4 mr-2 text-emerald-600" />
                                            <span>{new Date(appointment.scheduled_at).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <ClockIcon className="h-4 w-4 mr-2 text-emerald-600" />
                                            <span>{new Date(appointment.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <UserIcon className="h-4 w-4 mr-2 text-emerald-600" />
                                            <span>{appointment.user.name}</span>
                                        </div>
                                        {appointment.notes && (
                                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-500 italic">
                                                "{appointment.notes}"
                                            </div>
                                        )}
                                    </div>

                                    {appointment.status === 'pending' && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-3">
                                            <button 
                                                onClick={() => updateStatus(appointment.id, 'confirmed')}
                                                className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-700 focus:bg-emerald-700 active:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                <CheckCircleIcon className="h-4 w-4 mr-1" /> Confirmer
                                            </button>
                                            <button 
                                                onClick={() => updateStatus(appointment.id, 'refused')}
                                                className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                            >
                                                <XCircleIcon className="h-4 w-4 mr-1 text-red-500" /> Refuser
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
