import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminUsers({ auth, users }) {
    const [processingId, setProcessingId] = useState(null);

    const updateStatus = (id, status) => {
        if(confirm(`Êtes-vous sûr de vouloir ${status === 'blocked' ? 'bloquer' : 'débloquer'} cet utilisateur ?`)) {
            setProcessingId(id);
            router.patch(route('admin.users.updateStatus', id), { status }, {
                preserveScroll: true,
                onFinish: () => setProcessingId(null)
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion des Utilisateurs</h2>}
        >
            <Head title="Admin - Utilisateurs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold">Tous les Utilisateurs ({users.total})</h3>
                            <Link href={route('admin.dashboard')} className="text-sm text-indigo-600 hover:underline">
                                &larr; Retour au Dashboard
                            </Link>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                        <th className="px-6 py-4 font-bold">Utilisateur</th>
                                        <th className="px-6 py-4 font-bold">Rôle</th>
                                        <th className="px-6 py-4 font-bold">Activité</th>
                                        <th className="px-6 py-4 font-bold">Statut</th>
                                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase
                                                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : ''}
                                                    ${user.role === 'host' ? 'bg-blue-100 text-blue-800' : ''}
                                                    ${user.role === 'client' ? 'bg-gray-100 text-gray-800' : ''}
                                                `}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-gray-500">
                                                    {user.venues_count > 0 && <span className="block">{user.venues_count} salles créées</span>}
                                                    {user.bookings_count > 0 && <span className="block">{user.bookings_count} réservations</span>}
                                                    {user.venues_count === 0 && user.bookings_count === 0 && <span>Aucune activité</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${user.status === 'active' || !user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                                `}>
                                                    {user.status === 'active' || !user.status ? 'Actif' : 'Bloqué'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                {user.id !== auth.user.id && (
                                                    <>
                                                        {(user.status === 'active' || !user.status) ? (
                                                            <button 
                                                                disabled={processingId === user.id}
                                                                onClick={() => updateStatus(user.id, 'blocked')} 
                                                                className="inline-flex items-center px-3 py-1 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 disabled:opacity-50"
                                                            >
                                                                Bloquer
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                disabled={processingId === user.id}
                                                                onClick={() => updateStatus(user.id, 'active')} 
                                                                className="inline-flex items-center px-3 py-1 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 disabled:opacity-50"
                                                            >
                                                                Débloquer
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="p-4 border-t border-gray-200">
                            <div className="text-sm text-gray-500 text-center">
                                Affichage de {users.data.length} utilisateurs.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
