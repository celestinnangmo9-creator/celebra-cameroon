import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function AdminSettings({ auth, settings }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        commission_percentage: settings.commission_percentage || '10',
        maintenance_mode: settings.maintenance_mode === '1',
        payment_orange_money_active: settings.payment_orange_money_active === '1',
        payment_mtn_momo_active: settings.payment_mtn_momo_active === '1',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Configuration Globale</h2>}
        >
            <Head title="Admin - Paramètres" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex justify-between items-center mb-6">
                        <Link href={route('admin.dashboard')} className="text-indigo-600 hover:underline">
                            &larr; Retour au Dashboard
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 border-b border-gray-100">
                            <h3 className="text-lg font-bold mb-1">Paramètres de la Plateforme</h3>
                            <p className="text-sm text-gray-500 mb-6">Ces paramètres affectent le fonctionnement global de Celebra Cameroon.</p>
                            
                            <form onSubmit={submit} className="space-y-8">
                                
                                {/* Commission Section */}
                                <div>
                                    <h4 className="text-md font-bold text-gray-800 border-b pb-2 mb-4">Finances & Commission</h4>
                                    
                                    <div className="max-w-md">
                                        <InputLabel htmlFor="commission_percentage" value="Pourcentage de commission plateforme (%)" />
                                        <TextInput
                                            id="commission_percentage"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            className="mt-1 block w-full"
                                            value={data.commission_percentage}
                                            onChange={(e) => setData('commission_percentage', e.target.value)}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Exemple: 10 pour 10% retenu sur chaque réservation confirmée.</p>
                                        {errors.commission_percentage && <p className="mt-2 text-sm text-red-600">{errors.commission_percentage}</p>}
                                    </div>
                                </div>

                                {/* Payment Methods Section */}
                                <div>
                                    <h4 className="text-md font-bold text-gray-800 border-b pb-2 mb-4">Moyens de Paiement</h4>
                                    
                                    <div className="space-y-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 w-5 h-5"
                                                checked={data.payment_orange_money_active}
                                                onChange={(e) => setData('payment_orange_money_active', e.target.checked)}
                                            />
                                            <span className="ml-3 text-sm text-gray-700 font-medium">Activer Orange Money</span>
                                        </label>

                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 w-5 h-5"
                                                checked={data.payment_mtn_momo_active}
                                                onChange={(e) => setData('payment_mtn_momo_active', e.target.checked)}
                                            />
                                            <span className="ml-3 text-sm text-gray-700 font-medium">Activer MTN Mobile Money</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Maintenance Section */}
                                <div>
                                    <h4 className="text-md font-bold text-red-600 border-b pb-2 mb-4">Maintenance</h4>
                                    
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-red-600 shadow-sm focus:ring-red-500 w-5 h-5"
                                            checked={data.maintenance_mode}
                                            onChange={(e) => setData('maintenance_mode', e.target.checked)}
                                        />
                                        <span className="ml-3 text-sm text-gray-700 font-bold">Activer le mode maintenance (Interdit les nouvelles réservations)</span>
                                    </label>
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t">
                                    <button 
                                        disabled={processing}
                                        type="submit" 
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                    >
                                        Enregistrer les paramètres
                                    </button>

                                    {recentlySuccessful && (
                                        <p className="text-sm text-green-600 font-medium">
                                            <i className="fa-solid fa-check mr-1"></i> Sauvegardé.
                                        </p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
