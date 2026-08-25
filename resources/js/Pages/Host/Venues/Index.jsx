import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function HostVenuesIndex({ auth, venues }) {
    const { t } = useLanguage();
    const { patch, processing } = useForm();

    const handleToggleStatus = (venueId, currentStatus) => {
        let newStatus = 'active';
        if (currentStatus === 'active') newStatus = 'draft';
        if (currentStatus === 'draft') newStatus = 'active';
        if (currentStatus === 'suspended') return; // Cannot toggle if suspended by admin

        patch(route('host.venues.status', venueId), {
            data: { status: newStatus },
            preserveScroll: true,
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">Publiée</span>;
            case 'draft':
            case 'maintenance':
                return <span className="bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1 rounded-full text-xs font-bold">Brouillon</span>;
            case 'suspended':
                return <span className="bg-red-100 text-red-800 border border-red-200 px-3 py-1 rounded-full text-xs font-bold">Suspendue</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-2xl font-fraunces text-gray-800 dark:text-gray-200 leading-tight">Mes salles</h2>
                    <Link
                        href={route('venues.create')}
                        className="inline-flex items-center px-4 py-2 bg-[#0B3D2E] text-white font-semibold rounded-lg hover:bg-[#124d3a] transition-colors shadow-sm"
                    >
                        <i className="fa-solid fa-plus mr-2"></i>
                        Ajouter une salle
                    </Link>
                </div>
            }
        >
            <Head title="Mes salles - Prestataire" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {venues.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {venues.data.map((venue) => (
                                <div key={venue.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                    <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                                        {venue.main_image ? (
                                            <img src={venue.main_image} alt={venue.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <i className="fa-solid fa-image text-4xl"></i>
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 shadow-sm">
                                            {getStatusBadge(venue.status)}
                                        </div>
                                    </div>
                                    
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold font-fraunces text-gray-900 dark:text-gray-100 mb-2 truncate">
                                            {venue.title}
                                        </h3>
                                        
                                        <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400 flex-1">
                                            <div className="flex items-center gap-2">
                                                <i className="fa-solid fa-location-dot text-[#C9A227] w-4 text-center"></i>
                                                <span className="truncate">{venue.city}, {venue.district}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <i className="fa-solid fa-users text-[#C9A227] w-4 text-center"></i>
                                                <span>Jusqu'à {venue.capacity} personnes</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <i className="fa-solid fa-calendar-check text-[#C9A227] w-4 text-center"></i>
                                                <span>{venue.bookings_count} réservations reçues</span>
                                            </div>
                                        </div>
                                        
                                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex gap-2 flex-wrap items-center">
                                            <Link
                                                href={route('venues.edit', venue.id)}
                                                className="px-3 py-1.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                                            >
                                                Modifier
                                            </Link>
                                            
                                            <Link
                                                href={route('venues.show', venue.id)}
                                                className="px-3 py-1.5 text-sm font-semibold text-[#0B3D2E] bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 rounded-lg transition-colors border border-emerald-200"
                                            >
                                                Voir l'annonce
                                            </Link>
                                            
                                            {venue.status !== 'suspended' && (
                                                <button
                                                    onClick={() => handleToggleStatus(venue.id, venue.status)}
                                                    disabled={processing}
                                                    className={`ml-auto px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors border disabled:opacity-50 ${
                                                        venue.status === 'active' 
                                                            ? 'text-gray-600 bg-white hover:bg-gray-50 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                                                            : 'text-[#C9A227] bg-[#FAF6F0] border-[#C9A227]/30 hover:bg-[#F2ECE4] dark:bg-gray-800 dark:border-gray-600'
                                                    }`}
                                                >
                                                    {venue.status === 'active' ? 'Dépublier' : 'Publier'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                            <div className="w-24 h-24 bg-emerald-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="fa-solid fa-building text-4xl text-[#0B3D2E] dark:text-[#C9A227]"></i>
                            </div>
                            <h3 className="text-xl font-fraunces font-bold text-gray-900 dark:text-gray-100 mb-2">
                                Aucune salle enregistrée
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                Vous n'avez pas encore publié de salle. Ajoutez votre première salle pour commencer à recevoir des réservations.
                            </p>
                            <Link
                                href={route('venues.create')}
                                className="inline-flex items-center px-6 py-3 bg-[#0B3D2E] text-white font-medium rounded-xl hover:bg-[#124d3a] transition-all shadow-md hover:shadow-lg gap-2"
                            >
                                <i className="fa-solid fa-plus"></i>
                                Ajouter ma première salle
                            </Link>
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {venues.links && venues.links.length > 3 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex space-x-1">
                                {venues.links.map((link, i) => (
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
        </AuthenticatedLayout>
    );
}
