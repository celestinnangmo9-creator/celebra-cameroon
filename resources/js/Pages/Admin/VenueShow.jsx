import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import InputLabel from '@/Components/InputLabel';

export default function VenueShow({ auth, venue }) {
    const [processingId, setProcessingId] = useState(null);
    const [rejectionModal, setRejectionModal] = useState({ show: false, type: 'rejected' });
    const [reason, setReason] = useState('');

    const updateStatus = (status) => {
        if(confirm(`Êtes-vous sûr de vouloir approuver cette salle ?`)) {
            setProcessingId(venue.id);
            router.patch(route('admin.venues.updateStatus', venue.id), { status }, {
                preserveScroll: true,
                onFinish: () => setProcessingId(null)
            });
        }
    };

    const submitRejection = () => {
        setProcessingId(venue.id);
        router.patch(route('admin.venues.updateStatus', venue.id), { 
            status: rejectionModal.type,
            rejection_reason: reason
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setRejectionModal({ show: false, type: 'rejected' });
                setReason('');
            },
            onFinish: () => setProcessingId(null)
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Détails de la salle : {venue.title}</h2>}
        >
            <Head title={`Admin - Salle - ${venue.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="flex justify-between items-center">
                        <Link href={route('admin.venues')} className="text-indigo-600 hover:underline">
                            &larr; Retour aux annonces
                        </Link>
                        
                        <div className="space-x-3">
                            <a href={route('venues.show', venue.id)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest">
                                Voir en ligne <i className="fa-solid fa-external-link ml-2"></i>
                            </a>
                            
                            {venue.status !== 'approved' && (
                                <button 
                                    disabled={processingId === venue.id}
                                    onClick={() => updateStatus('approved')} 
                                    className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 disabled:opacity-50"
                                >
                                    Approuver
                                </button>
                            )}
                            
                            {(venue.status === 'pending') && (
                                <button 
                                    disabled={processingId === venue.id}
                                    onClick={() => setRejectionModal({ show: true, type: 'rejected' })} 
                                    className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 disabled:opacity-50"
                                >
                                    Rejeter
                                </button>
                            )}

                            {(venue.status === 'approved') && (
                                <button 
                                    disabled={processingId === venue.id}
                                    onClick={() => setRejectionModal({ show: true, type: 'suspended' })} 
                                    className="inline-flex items-center px-4 py-2 bg-orange-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-orange-700 disabled:opacity-50"
                                >
                                    Suspendre
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Status Header */}
                        <div className={`p-4 border-b ${venue.status === 'approved' ? 'bg-green-50 border-green-200' : (venue.status === 'pending' ? 'bg-yellow-50 border-yellow-200' : (venue.status === 'suspended' ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'))}`}>
                            <div className="flex items-center gap-3">
                                <span className="font-bold uppercase tracking-wider text-sm">Statut Actuel :</span>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold uppercase
                                    ${venue.status === 'approved' ? 'bg-green-200 text-green-900' : ''}
                                    ${venue.status === 'pending' ? 'bg-yellow-200 text-yellow-900' : ''}
                                    ${venue.status === 'rejected' ? 'bg-red-200 text-red-900' : ''}
                                    ${venue.status === 'suspended' ? 'bg-orange-200 text-orange-900' : ''}
                                `}>
                                    {venue.status}
                                </span>
                            </div>
                            {venue.rejection_reason && (
                                <div className="mt-2 text-sm text-red-700">
                                    <span className="font-bold">Motif du rejet/suspension : </span> {venue.rejection_reason}
                                </div>
                            )}
                        </div>
                        
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{venue.title}</h3>
                                    <p className="text-gray-500">{venue.address}, {venue.district}, {venue.city}, {venue.region}</p>
                                </div>
                                
                                <div>
                                    <h4 className="font-bold text-lg mb-2">Description</h4>
                                    <div className="prose text-gray-700 max-w-none">
                                        {venue.description.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-bold text-gray-500 uppercase">Capacité</p>
                                        <p className="text-lg font-bold">{venue.capacity} personnes</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-bold text-gray-500 uppercase">Catégorie</p>
                                        <p className="text-lg font-bold capitalize">{venue.category}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-bold text-gray-500 uppercase">Prix par jour</p>
                                        <p className="text-lg font-bold">{new Intl.NumberFormat('fr-FR').format(venue.price_per_day)} FCFA</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-bold text-gray-500 uppercase">Prix par heure</p>
                                        <p className="text-lg font-bold">{venue.price_per_hour ? new Intl.NumberFormat('fr-FR').format(venue.price_per_hour) + ' FCFA' : 'N/A'}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-lg mb-2">Commodités</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {venue.amenities && venue.amenities.length > 0 ? venue.amenities.map((item, idx) => (
                                            <span key={idx} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                                                {item}
                                            </span>
                                        )) : <span className="text-gray-500">Aucune commodité spécifiée.</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <h4 className="font-bold text-lg mb-4">Informations Hôte</h4>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                                            {venue.user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <Link href={route('admin.users.show', venue.user.id)} className="font-bold hover:underline">{venue.user.name}</Link>
                                            <p className="text-xs text-gray-500">{venue.user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-lg mb-2">Image Principale</h4>
                                    {venue.main_image ? (
                                        <img src={`/storage/${venue.main_image}`} alt="Main" className="w-full h-48 object-cover rounded-lg shadow-sm" />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">Aucune image</div>
                                    )}
                                </div>
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
                                onClick={() => { setRejectionModal({ show: false, type: 'rejected' }); setReason(''); }}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={submitRejection}
                                disabled={processingId === venue.id || reason.trim() === ''}
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
