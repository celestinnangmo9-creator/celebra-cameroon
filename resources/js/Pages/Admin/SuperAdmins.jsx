import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function SuperAdmins({ auth, superAdmins = [], otherUsers = [] }) {
    const { t } = useLanguage();
    const [mode, setMode] = useState('existing'); // 'existing' | 'new'
    const [confirmDemoteId, setConfirmDemoteId] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        name: '',
        password: '',
        role: 'super_admin'
    });

    const handleSelectUser = (e) => {
        const selectedId = e.target.value;
        if (!selectedId) {
            setData({ ...data, email: '', name: '' });
            return;
        }
        const user = otherUsers.find(u => String(u.id) === String(selectedId));
        if (user) {
            setData({
                ...data,
                email: user.email,
                name: user.name,
            });
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.superAdmins.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            }
        });
    };

    const handleDemote = (id) => {
        router.delete(route('admin.superAdmins.destroy', id), {
            preserveScroll: true,
            onFinish: () => setConfirmDemoteId(null)
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                            <i className="fa-solid fa-crown text-lg"></i>
                        </div>
                        <div>
                            <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 leading-tight">
                                Super Administrateurs
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Gestion manuelle des privilèges de haute administration
                            </p>
                        </div>
                    </div>
                    <Link
                        href={route('admin.users')}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        Tous les utilisateurs
                    </Link>
                </div>
            }
        >
            <Head title="Super Admins - Celebra Cameroon" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                {/* Information Banner */}
                <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 dark:from-amber-950/30 dark:via-rose-950/30 dark:to-purple-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                            <i className="fa-solid fa-shield-halved text-lg"></i>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                                Espace Réservé au Super Administrateur
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                En tant que Super Admin (<strong>{auth.user.email}</strong>), vous avez le plein pouvoir pour promouvoir manuellement n'importe quel utilisateur ou inscrire de nouveaux collaborateurs avec le rang de <strong>Super Admin</strong> ou <strong>Admin</strong>.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Form: Nommer / Créer manuellement un Super Admin */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                                <i className="fa-solid fa-user-plus text-amber-500"></i>
                                <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                                    Ajouter / Promouvoir
                                </h3>
                            </div>

                            {/* Mode Toggle */}
                            <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl mb-5 text-xs font-semibold">
                                <button
                                    type="button"
                                    onClick={() => setMode('existing')}
                                    className={`py-1.5 rounded-lg transition-all ${
                                        mode === 'existing'
                                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
                                    }`}
                                >
                                    Compte Existant
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('new')}
                                    className={`py-1.5 rounded-lg transition-all ${
                                        mode === 'new'
                                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
                                    }`}
                                >
                                    Nouveau Compte
                                </button>
                            </div>

                            <form onSubmit={submit} className="space-y-4">
                                {mode === 'existing' && (
                                    <div>
                                        <InputLabel value="Choisir un utilisateur inscrit" />
                                        <select
                                            onChange={handleSelectUser}
                                            className="mt-1 block w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:border-amber-500 focus:ring-amber-500"
                                        >
                                            <option value="">-- Sélectionner dans la liste --</option>
                                            {otherUsers.map(u => (
                                                <option key={u.id} value={u.id}>
                                                    {u.name} ({u.email}) - {u.role}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-[11px] text-gray-400 mt-1">Ou tapez son email directement ci-dessous.</p>
                                    </div>
                                )}

                                <div>
                                    <InputLabel htmlFor="email" value="Adresse Email *" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="exemple@celebra.cm"
                                        className="mt-1 block w-full text-sm rounded-xl"
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="name" value="Nom complet" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Nom & Prénom"
                                        className="mt-1 block w-full text-sm rounded-xl"
                                    />
                                    <InputError message={errors.name} className="mt-1" />
                                </div>

                                {mode === 'new' && (
                                    <div>
                                        <InputLabel htmlFor="password" value="Mot de passe initial (facultatif)" />
                                        <TextInput
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            placeholder="Par défaut: ange2727"
                                            className="mt-1 block w-full text-sm rounded-xl"
                                        />
                                        <p className="text-[11px] text-gray-400 mt-1">Laissez vide pour utiliser "ange2727".</p>
                                        <InputError message={errors.password} className="mt-1" />
                                    </div>
                                )}

                                <div>
                                    <InputLabel value="Rôle attribué *" />
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                                            data.role === 'super_admin'
                                                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 font-bold'
                                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="super_admin"
                                                checked={data.role === 'super_admin'}
                                                onChange={e => setData('role', e.target.value)}
                                                className="text-amber-600 focus:ring-amber-500"
                                            />
                                            <span>👑 Super Admin</span>
                                        </label>

                                        <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                                            data.role === 'admin'
                                                ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 font-bold'
                                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="admin"
                                                checked={data.role === 'admin'}
                                                onChange={e => setData('role', e.target.value)}
                                                className="text-purple-600 focus:ring-purple-500"
                                            />
                                            <span>🛡️ Admin standard</span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                                            Enregistrement...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-shield-check"></i>
                                            {mode === 'existing' ? 'Promouvoir en Administrateur' : 'Créer l\'Administrateur'}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List of current Super Admins and Admins */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                                        Administrateurs Actuels ({superAdmins.length})
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Liste de tous les comptes disposant d'un accès administrateur
                                    </p>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {superAdmins.map((admin) => {
                                    const isCurrent = admin.id === auth.user.id;
                                    const isSuper = admin.role === 'super_admin';

                                    return (
                                        <div
                                            key={admin.id}
                                            className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-gray-50/60 dark:hover:bg-gray-750 transition-colors"
                                        >
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base shadow-sm shrink-0 ${
                                                    isSuper
                                                        ? 'bg-gradient-to-tr from-amber-500 to-rose-500 text-white'
                                                        : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                                                }`}>
                                                    {admin.avatar ? (
                                                        <img
                                                            src={admin.avatar.startsWith('http') || admin.avatar.startsWith('/') ? admin.avatar : `/storage/${admin.avatar}`}
                                                            alt={admin.name}
                                                            className="w-full h-full object-cover rounded-2xl"
                                                        />
                                                    ) : (
                                                        admin.name ? admin.name.charAt(0).toUpperCase() : 'A'
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">
                                                            {admin.name || 'Sans nom'}
                                                        </h4>
                                                        {isCurrent && (
                                                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                                                Vous
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {admin.email}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                            isSuper
                                                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
                                                                : 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300'
                                                        }`}>
                                                            {isSuper ? '👑 Super Admin' : '🛡️ Admin'}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400">
                                                            Inscrit le {new Date(admin.created_at).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div>
                                                {isCurrent ? (
                                                    <span className="text-xs text-gray-400 italic px-2">
                                                        Connecté
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmDemoteId(admin.id)}
                                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors flex items-center gap-1.5"
                                                        title="Retirer les droits d'administration"
                                                    >
                                                        <i className="fa-solid fa-user-minus"></i>
                                                        <span className="hidden sm:inline">Rétrograder</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {superAdmins.length === 0 && (
                                    <div className="p-8 text-center text-gray-500 text-sm">
                                        Aucun administrateur trouvé.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal for Demote */}
            {confirmDemoteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-gray-700">
                        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 text-xl mx-auto">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
                            Confirmer la rétrogradation
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-6">
                            Cet utilisateur perdra immédiatement tous ses privilèges d'administrateur et reviendra au rôle de client standard.
                        </p>
                        <div className="flex gap-3">
                            <SecondaryButton
                                onClick={() => setConfirmDemoteId(null)}
                                className="w-full justify-center text-xs"
                            >
                                Annuler
                            </SecondaryButton>
                            <button
                                type="button"
                                onClick={() => handleDemote(confirmDemoteId)}
                                className="w-full justify-center px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
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
