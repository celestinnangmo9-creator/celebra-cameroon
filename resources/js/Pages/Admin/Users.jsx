import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function AdminUsers({ auth, users, filters = {} }) {
    const [processingId, setProcessingId] = useState(null);
    const [roleModal, setRoleModal] = useState({ show: false, userId: null, currentRole: '' });

    const { data: filterData, setData: setFilterData, get } = useForm({
        search: filters.search || '',
        role: filters.role || '',
        status: filters.status || ''
    });

    const updateStatus = (id, status) => {
        if(confirm(`Êtes-vous sûr de vouloir ${status === 'blocked' ? 'bloquer' : 'débloquer'} cet utilisateur ?`)) {
            setProcessingId(id);
            router.patch(route('admin.users.updateStatus', id), { status }, {
                preserveScroll: true,
                onFinish: () => setProcessingId(null)
            });
        }
    };

    const updateRole = () => {
        setProcessingId(roleModal.userId);
        router.patch(route('admin.users.updateStatus', roleModal.userId), { role: roleModal.currentRole }, {
            preserveScroll: true,
            onSuccess: () => setRoleModal({ show: false, userId: null, currentRole: '' }),
            onFinish: () => setProcessingId(null)
        });
    };

    const deleteUser = (id) => {
        if(confirm(`Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action placera le compte dans la corbeille (Soft Delete).`)) {
            setProcessingId(id);
            router.delete(route('admin.users.destroy', id), {
                preserveScroll: true,
                onFinish: () => setProcessingId(null)
            });
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('admin.users'), { preserveState: true });
    };

    const resetFilters = () => {
        router.get(route('admin.users'));
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
                        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <h3 className="text-lg font-bold text-gray-900">Tous les Utilisateurs ({users.total})</h3>
                            <Link href={route('admin.dashboard')} className="text-sm text-indigo-600 hover:underline">
                                &larr; Retour au Dashboard
                            </Link>
                        </div>
                        
                        {/* Filters */}
                        <div className="p-4 bg-gray-50 border-b border-gray-100">
                            <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="w-full md:w-1/3">
                                    <InputLabel value="Recherche (nom, email)" />
                                    <TextInput 
                                        className="w-full mt-1" 
                                        value={filterData.search}
                                        onChange={e => setFilterData('search', e.target.value)}
                                        placeholder="Rechercher..."
                                    />
                                </div>
                                <div className="w-full md:w-1/4">
                                    <InputLabel value="Rôle" />
                                    <select 
                                        className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                        value={filterData.role}
                                        onChange={e => setFilterData('role', e.target.value)}
                                    >
                                        <option value="">Tous les rôles</option>
                                        <option value="client">Client</option>
                                        <option value="owner">Propriétaire</option>
                                        <option value="admin">Administrateur</option>
                                    </select>
                                </div>
                                <div className="w-full md:w-1/4">
                                    <InputLabel value="Statut" />
                                    <select 
                                        className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                        value={filterData.status}
                                        onChange={e => setFilterData('status', e.target.value)}
                                    >
                                        <option value="">Tous les statuts</option>
                                        <option value="active">Actif</option>
                                        <option value="blocked">Bloqué</option>
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
                                        <th className="px-6 py-4 font-bold">Utilisateur</th>
                                        <th className="px-6 py-4 font-bold">Rôle</th>
                                        <th className="px-6 py-4 font-bold">Activité</th>
                                        <th className="px-6 py-4 font-bold">Statut</th>
                                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.data.length > 0 ? users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <Link href={route('admin.users.show', user.id)} className="text-sm font-bold text-indigo-600 hover:underline">{user.name}</Link>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase
                                                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : ''}
                                                        ${user.role === 'owner' ? 'bg-amber-100 text-amber-800' : ''}
                                                        ${user.role === 'client' ? 'bg-emerald-100 text-emerald-800' : ''}
                                                    `}>
                                                        {user.role}
                                                    </span>
                                                    {user.id !== auth.user.id && (
                                                        <button 
                                                            onClick={() => setRoleModal({ show: true, userId: user.id, currentRole: user.role })}
                                                            className="text-gray-400 hover:text-indigo-600"
                                                            title="Changer de rôle"
                                                        >
                                                            <i className="fa-solid fa-pen text-xs"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-gray-500">
                                                    {user.venues_count > 0 && <span className="block">{user.venues_count} salles</span>}
                                                    {user.bookings_count > 0 && <span className="block">{user.bookings_count} résas</span>}
                                                    {user.venues_count === 0 && user.bookings_count === 0 && <span>-</span>}
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
                                                <Link href={route('admin.users.show', user.id)} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest">
                                                    Détails
                                                </Link>
                                                {user.id !== auth.user.id && (
                                                    <>
                                                        {(user.status === 'active' || !user.status) ? (
                                                            <button 
                                                                disabled={processingId === user.id}
                                                                onClick={() => updateStatus(user.id, 'blocked')} 
                                                                className="inline-flex items-center px-3 py-1 bg-amber-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-amber-700 disabled:opacity-50"
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
                                                        <button 
                                                            disabled={processingId === user.id}
                                                            onClick={() => deleteUser(user.id)} 
                                                            className="inline-flex items-center px-3 py-1 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                Aucun utilisateur ne correspond à votre recherche.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination (Simple for Inertia links) */}
                        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Affichage de {users.data.length} sur {users.total} utilisateurs
                            </div>
                            <div className="flex gap-1 flex-wrap">
                                {users.links.map((link, k) => (
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

            {/* Role Modal */}
            {roleModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Changer le rôle</h3>
                        
                        <div className="mb-6 space-y-3">
                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="role" value="client" checked={roleModal.currentRole === 'client'} onChange={e => setRoleModal({...roleModal, currentRole: e.target.value})} className="text-indigo-600" />
                                <div>
                                    <div className="font-bold text-sm">Client</div>
                                    <div className="text-xs text-gray-500">Peut réserver des salles</div>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="role" value="owner" checked={roleModal.currentRole === 'owner'} onChange={e => setRoleModal({...roleModal, currentRole: e.target.value})} className="text-indigo-600" />
                                <div>
                                    <div className="font-bold text-sm">Propriétaire</div>
                                    <div className="text-xs text-gray-500">Peut ajouter et gérer des salles</div>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="role" value="admin" checked={roleModal.currentRole === 'admin'} onChange={e => setRoleModal({...roleModal, currentRole: e.target.value})} className="text-indigo-600" />
                                <div>
                                    <div className="font-bold text-sm">Administrateur</div>
                                    <div className="text-xs text-gray-500">Accès total à la plateforme</div>
                                </div>
                            </label>
                        </div>
                        
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={() => setRoleModal({ show: false, userId: null, currentRole: '' })}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={updateRole}
                                disabled={processingId === roleModal.userId}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
