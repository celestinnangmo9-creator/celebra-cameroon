import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';

export default function Subscriptions({ auth, plans }) {
    const { flash } = usePage().props;
    const [editingPlan, setEditingPlan] = useState(null);

    const { data, setData, put, processing, errors, reset } = useForm({
        price: '',
        max_venues: ''
    });

    const handleEdit = (plan) => {
        setEditingPlan(plan.id);
        setData({
            price: plan.price,
            max_venues: plan.max_venues || ''
        });
    };

    const handleCancel = () => {
        setEditingPlan(null);
        reset();
    };

    const handleSubmit = (e, planId) => {
        e.preventDefault();
        put(route('admin.subscriptions.update', planId), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingPlan(null);
                reset();
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Gestion des Abonnements
                    </h2>
                    <div className="flex space-x-4">
                        <NavLink href={route('admin.dashboard')} active={false}>
                            Retour au Dashboard Admin
                        </NavLink>
                    </div>
                </div>
            }
        >
            <Head title="Admin - Gestion des Abonnements" />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {flash?.success && (
                        <div className="mb-6 bg-emerald-100 border-l-4 border-emerald-500 text-emerald-800 px-5 py-4 rounded shadow">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-bold mb-6 font-['Fraunces'] text-[#0B3D2E] dark:text-[#C9A227]">
                                Formules d'abonnement disponibles
                            </h3>

                            <div className="grid md:grid-cols-2 gap-8">
                                {plans.map((plan) => (
                                    <div key={plan.id} className="border dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-900 shadow-sm relative">
                                        {plan.slug === 'premium' && (
                                            <div className="absolute top-4 right-4 bg-[#C9A227] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                                Premium
                                            </div>
                                        )}
                                        <h4 className="text-xl font-bold mb-4">{plan.name}</h4>
                                        
                                        {editingPlan === plan.id ? (
                                            <form onSubmit={(e) => handleSubmit(e, plan.id)} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prix (FCFA/mois)</label>
                                                    <input
                                                        type="number"
                                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-[#C9A227] focus:ring-[#C9A227]"
                                                        value={data.price}
                                                        onChange={e => setData('price', e.target.value)}
                                                        min="0"
                                                        required
                                                    />
                                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                                </div>

                                                {plan.slug === 'basique' && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre max de salles</label>
                                                        <input
                                                            type="number"
                                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-[#C9A227] focus:ring-[#C9A227]"
                                                            value={data.max_venues}
                                                            onChange={e => setData('max_venues', e.target.value)}
                                                            min="1"
                                                            required
                                                        />
                                                        {errors.max_venues && <p className="text-red-500 text-xs mt-1">{errors.max_venues}</p>}
                                                    </div>
                                                )}

                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="bg-[#0B3D2E] hover:bg-[#124d3a] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
                                                    >
                                                        Enregistrer
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleCancel}
                                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium text-sm transition-colors"
                                                    >
                                                        Annuler
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex items-end gap-2">
                                                    <span className="text-3xl font-bold text-[#0B3D2E] dark:text-white">
                                                        {parseInt(plan.price).toLocaleString()}
                                                    </span>
                                                    <span className="text-gray-500 mb-1">FCFA/mois</span>
                                                </div>

                                                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                                    <li>• {plan.max_venues ? `Maximum ${plan.max_venues} salles actives` : 'Salles actives illimitées'}</li>
                                                    <li>• {plan.is_featured ? 'Mise en avant automatique' : 'Pas de mise en avant'}</li>
                                                </ul>

                                                <button
                                                    onClick={() => handleEdit(plan)}
                                                    className="mt-4 text-[#C9A227] hover:text-yellow-600 font-bold text-sm flex items-center gap-1 transition-colors"
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i> Modifier les paramètres
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
