import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import InputLabel from '@/Components/InputLabel';

export default function AdminVenues({ auth, venues, filters = {} }) {
    const [processingId, setProcessingId] = useState(null);
    const [rejectionModal, setRejectionModal] = useState({ show: false, venueId: null, type: 'rejected' });
    
    const { data: filterData, setData: setFilterData, get } = useForm({
        status: filters.status || ''
    });

    const [reason, setReason] = useState('');

    const updateStatus = (id, status) => {
        if(confirm(`Êtes-vous sûr de vouloir approuver cette salle ?`)) {
            setProcessingId(id);
            router.patch(route('admin.venues.updateStatus', id), { status }, {
                preserveScroll: true,
                onFinish: () => setProcessingId(null)
            });
        }
    };

    const submitRejection = () => {
        setProcessingId(rejectionModal.venueId);
        router.patch(route('admin.venues.updateStatus', rejectionModal.venueId), { 
            status: rejectionModal.type,
            rejection_reason: reason
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setRejectionModal({ show: false, venueId: null, type: 'rejected' });
                setReason('');
            },
            onFinish: () => setProcessingId(null)
        });
    };

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('admin.venues'), { preserveState: true });
    };

    const resetFilters = () => {
        router.get(route('admin.venues'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion des Annonces (Salles)</h2>}
        >
            <Head title="Admin - Annonces" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <h3 className="text-lg font-bold text-gray-900">Toutes les Salles ({venues.total})</h3>
                            <Link href={route('admin.dashboard')} className="text-sm text-indigo-600 hover:underline">
                                &larr; Retour au Dashboard
                            </Link>
                        </div>
                        
                        {/* Filters */}
                        <div className="p-4 bg-gray-50 border-b border-gray-100">
                            <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="w-full md:w-1/4">
                                    <InputLabel value="Statut" />
                                    <select 
                                        className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                        value={filterData.status}
                                        onChange={e => setFilterData('status', e.target.value)}
                                    >
                                        <option value="">Tous les statuts</option>
                                        <option value="pending">En attente</option>
                                        <option value="approved">Approuvée</option>
                                        <option value="rejected">Rejetée</option>
                                        <option value="suspended">Suspendue</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
                                        Filtrer
                                    </button>
                                    <button type="button" onClick={resetFilters} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium">
                                        Réinitialiser
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                        <th className="px-6 py-4 font-bold">Salle</th>
                                        <th className="px-6 py-4 font-bold">Hôte</th>
                                        <th className="px-6 py-4 font-bold">Prix</th>
                                        <th className="px-6 py-4 font-bold">Statut</th>
                                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {venues.data.length > 0 ? venues.data.map((venue) => (
                                        <tr key={venue.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <Link href={route('admin.venues.show', venue.id)} className="font-bold text-indigo-600 hover:underline">
                                                    {venue.title}
                                                </Link>
                                                <div className="text-xs text-gray-500 mt-1">{venue.city}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    <Link href={route('admin.users.show', venue.user_id)} className="hover:underline">{venue.user?.name}</Link>
                                                </div>
                                                <div className="text-xs text-gray-500">{venue.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold">{new Intl.NumberFormat('fr-FR').format(venue.price_per_day)} FCFA</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase
                                                    ${venue.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                                    ${venue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    ${venue.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                                    ${venue.status === 'suspended' ? 'bg-orange-100 text-orange-800' : ''}
                                                `}>
                                                    {venue.status}
                                                </span>
                                                {venue.rejection_reason && (
                                                    <p className="text-xs text-red-600 mt-1 max-w-[200px] truncate" title={venue.rejection_reason}>
                                                        Motif: {venue.rejection_reason}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Link href={route('admin.venues.show', venue.id)} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest">
                                                    Détails
                                                </Link>
                                                
                                                {venue.status !== 'approved' && (
                                                    <button 
                                                        disabled={processingId === venue.id}
                                                        onClick={() => updateStatus(venue.id, 'approved')} 
                                                        className="inline-flex items-center px-3 py-1 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        Approuver
                                                    </button>
                                                )}
                                                
                                                {(venue.status === 'pending') && (
                                                    <button 
                                                        disabled={processingId === venue.id}
                                                        onClick={() => setRejectionModal({ show: true, venueId: venue.id, type: 'rejected' })} 
                                                        className="inline-flex items-center px-3 py-1 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 disabled:opacity-50"
                                                    >
                                                        Rejeter
                                                    </button>
                                                )}

                                                {(venue.status === 'approved') && (
                                                    <button 
                                                        disabled={processingId === venue.id}
                                                        onClick={() => setRejectionModal({ show: true, venueId: venue.id, type: 'suspended' })} 
                                                        className="inline-flex items-center px-3 py-1 bg-orange-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-orange-700 disabled:opacity-50"
                                                    >
                                                        Suspendre
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                Aucune salle trouvée.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Affichage de {venues.data.length} sur {venues.total} salles
                            </div>
                            <div className="flex gap-1 flex-wrap">
                                {venues.links.map((link, k) => (
                                    <Link
                                        key={k}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 border rounded text-sm ${link.active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 hover:bg-gray-50'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Rejection / Suspension Modal */}
            {rejectionModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {rejectionModal.type === 'suspended' ? 'Suspendre la salle' : 'Rejeter la salle'}
                        </h3>
                        
                        <div className="mb-6">
                            <InputLabel value="Motif (obligatoire)" className="mb-2" />
                            <textarea
                                className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                rows="4"
                                placeholder="Veuillez expliquer pourquoi cette salle ne respecte pas les critères..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={() => { setRejectionModal({ show: false, venueId: null, type: 'rejected' }); setReason(''); }}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={submitRejection}
                                disabled={processingId === rejectionModal.venueId || reason.trim() === ''}
                                className={`px-4 py-2 text-white font-bold rounded-lg transition-colors disabled:opacity-50
                                    ${rejectionModal.type === 'suspended' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-red-600 hover:bg-red-700'}
                                `}
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
