import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminVenues({ auth, venues }) {
    const [processingId, setProcessingId] = useState(null);

    const updateStatus = (id, status) => {
        if(confirm(`Êtes-vous sûr de vouloir ${status === 'approved' ? 'approuver' : 'rejeter'} cette salle ?`)) {
            setProcessingId(id);
            router.patch(route('admin.venues.updateStatus', id), { status }, {
                preserveScroll: true,
                onFinish: () => setProcessingId(null)
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion des Salles</h2>}
        >
            <Head title="Admin - Salles" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold">Toutes les Salles ({venues.total})</h3>
                            <Link href={route('admin.dashboard')} className="text-sm text-indigo-600 hover:underline">
                                &larr; Retour au Dashboard
                            </Link>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                        <th className="px-6 py-4 font-bold">Salle</th>
                                        <th className="px-6 py-4 font-bold">Hôte</th>
                                        <th className="px-6 py-4 font-bold">Prix</th>
                                        <th className="px-6 py-4 font-bold">Statut</th>
                                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {venues.data.map((venue) => (
                                        <tr key={venue.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <a href={route('venues.show', venue.id)} className="font-bold text-indigo-600 hover:underline">
                                                    {venue.title}
                                                </a>
                                                <div className="text-xs text-gray-500 mt-1">{venue.city}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{venue.user?.name}</div>
                                                <div className="text-xs text-gray-500">{venue.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold">{new Intl.NumberFormat('fr-FR').format(venue.price_per_day)} FCFA</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${venue.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                                    ${venue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    ${venue.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                                `}>
                                                    {venue.status === 'approved' ? 'Publiée' : (venue.status === 'pending' ? 'En attente' : 'Rejetée')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                {venue.status !== 'approved' && (
                                                    <button 
                                                        disabled={processingId === venue.id}
                                                        onClick={() => updateStatus(venue.id, 'approved')} 
                                                        className="inline-flex items-center px-3 py-1 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        Approuver
                                                    </button>
                                                )}
                                                {venue.status !== 'rejected' && (
                                                    <button 
                                                        disabled={processingId === venue.id}
                                                        onClick={() => updateStatus(venue.id, 'rejected')} 
                                                        className="inline-flex items-center px-3 py-1 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 disabled:opacity-50"
                                                    >
                                                        Rejeter
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="p-4 border-t border-gray-200">
                            {/* Pagination would go here if we implemented a custom pagination component for Inertia, for now it's simplified */}
                            <div className="text-sm text-gray-500 text-center">
                                Affichage de {venues.data.length} salles.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
