import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function Subscription({ auth, plans, userSubscription }) {
    const { t } = useLanguage();
    const { post, processing } = useForm();
    const { flash } = usePage().props;

    const handleSubscribe = (planSlug) => {
        post(route('subscriptions.subscribe', { plan_slug: planSlug }), {
            preserveScroll: true
        });
    };

    const isExpired = userSubscription.status === 'expired';
    
    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
    };

    const getDaysRemaining = (dateString) => {
        if (!dateString) return 0;
        const end = new Date(dateString);
        const now = new Date();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const daysRemaining = userSubscription.status === 'trial' 
        ? getDaysRemaining(userSubscription.trial_ends_at)
        : getDaysRemaining(userSubscription.subscription_ends_at);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mon Abonnement</h2>}
        >
            <Head title="Mon Abonnement" />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Status Banner */}
                    <div className={`mb-8 p-6 rounded-2xl shadow-lg border-l-4 flex flex-col sm:flex-row items-center justify-between gap-4 ${
                        isExpired 
                        ? 'bg-red-50 border-red-500' 
                        : (userSubscription.status === 'trial' ? 'bg-blue-50 border-blue-500' : 'bg-[#0B3D2E]/10 border-[#0B3D2E]')
                    }`}>
                        <div>
                            <h3 className={`text-xl font-bold font-['Fraunces'] ${isExpired ? 'text-red-800' : 'text-gray-900 dark:text-gray-100'}`}>
                                Statut de votre compte : 
                                <span className={`ml-2 uppercase px-3 py-1 text-sm rounded-full ${
                                    isExpired ? 'bg-red-200 text-red-800' 
                                    : (userSubscription.status === 'trial' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800')
                                }`}>
                                    {isExpired ? t('dashboard.subscription.status_expired') : (userSubscription.status === 'trial' ? t('dashboard.subscription.status_trial') : t('dashboard.subscription.status_active'))}
                                </span>
                            </h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                {isExpired ? (
                                    t('dashboard.subscription.expired_message')
                                ) : userSubscription.status === 'trial' ? (
                                    t('dashboard.subscription.trial_remaining').replace('{days}', daysRemaining)
                                ) : (
                                    t('dashboard.subscription.active_until').replace('{plan}', userSubscription.plan === 'premium' ? t('dashboard.subscription.plan_premium') : t('dashboard.subscription.plan_basic')).replace('{date}', formatDate(userSubscription.subscription_ends_at))
                                )}
                            </p>
                        </div>
                        {isExpired && (
                            <div className="text-red-500 text-5xl">
                                <i className="fa-solid fa-circle-exclamation"></i>
                            </div>
                        )}
                    </div>

                    {/* Plans Grid */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-['Fraunces'] mb-4">Choisissez votre formule</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Passez à la vitesse supérieure et débloquez tout le potentiel de vos espaces événementiels sur Celebra Cameroon.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan) => (
                            <div key={plan.id} className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-2 ${plan.slug === 'premium' ? 'border-[#C9A227]' : 'border-transparent'}`}>
                                {plan.slug === 'premium' && (
                                    <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-[#C9A227] to-yellow-500 text-white text-center py-2 font-bold text-sm tracking-wider uppercase">
                                        Recommandé
                                    </div>
                                )}
                                
                                <div className={`p-8 ${plan.slug === 'premium' ? 'pt-12' : ''}`}>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-2 mb-6">
                                        <span className="text-4xl font-extrabold text-[#0B3D2E] dark:text-[#C9A227]">{parseInt(plan.price).toLocaleString()}</span>
                                        <span className="text-gray-500 font-medium">FCFA / mois</span>
                                    </div>
                                    
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-center text-gray-600 dark:text-gray-300">
                                            <i className="fa-solid fa-check text-green-500 w-6"></i>
                                            <span>{plan.max_venues ? t('dashboard.subscription.up_to_venues').replace('{count}', plan.max_venues) : t('dashboard.subscription.unlimited_venues')}</span>
                                        </li>
                                        <li className="flex items-center text-gray-600 dark:text-gray-300">
                                            <i className="fa-solid fa-check text-green-500 w-6"></i>
                                            <span>{t('dashboard.subscription.booking_management')}</span>
                                        </li>
                                        <li className="flex items-center text-gray-600 dark:text-gray-300">
                                            <i className="fa-solid fa-check text-green-500 w-6"></i>
                                            <span>{t('dashboard.subscription.direct_messaging')}</span>
                                        </li>
                                        {plan.is_featured ? (
                                            <>
                                                <li className="flex items-center text-gray-600 dark:text-gray-300 font-bold">
                                                    <i className="fa-solid fa-star text-[#C9A227] w-6"></i>
                                                    <span>Mise en avant automatique des salles</span>
                                                </li>
                                                <li className="flex items-center text-gray-600 dark:text-gray-300 font-bold">
                                                    <i className="fa-solid fa-certificate text-[#C9A227] w-6"></i>
                                                    <span>{t('dashboard.subscription.verified_badge')}</span>
                                                </li>
                                            </>
                                        ) : (
                                            <>
                                                <li className="flex items-center text-gray-400 line-through">
                                                    <i className="fa-solid fa-xmark text-red-300 w-6"></i>
                                                    <span>Mise en avant automatique</span>
                                                </li>
                                                <li className="flex items-center text-gray-400 line-through">
                                                    <i className="fa-solid fa-xmark text-red-300 w-6"></i>
                                                    <span>{t('dashboard.subscription.verified_badge')}</span>
                                                </li>
                                            </>
                                        )}
                                    </ul>

                                    <button
                                        onClick={() => handleSubscribe(plan.slug)}
                                        disabled={processing || (userSubscription.plan === plan.slug && !isExpired)}
                                        className={`w-full py-4 rounded-xl font-bold transition-all shadow-md flex justify-center items-center gap-2 ${
                                            userSubscription.plan === plan.slug && !isExpired
                                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                : plan.slug === 'premium'
                                                    ? 'bg-[#0B3D2E] text-white hover:bg-[#124d3a] hover:shadow-lg border border-[#C9A227]'
                                                    : 'bg-white text-[#0B3D2E] border-2 border-[#0B3D2E] hover:bg-gray-50'
                                        }`}
                                    >
                                        {userSubscription.plan === plan.slug && !isExpired ? (
                                            <>
                                                <i className="fa-solid fa-check"></i> Formule Actuelle
                                            </>
                                        ) : (
                                            <>
                                                {t('dashboard.subscription.subscribe_to').replace('{plan}', plan.name)}
                                                {processing && <i className="fa-solid fa-circle-notch fa-spin"></i>}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
