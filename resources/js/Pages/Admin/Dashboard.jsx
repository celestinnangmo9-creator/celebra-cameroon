import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AdminDashboard({ auth, kpis }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Administration Globale</h2>}
        >
            <Head title="Super Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">Vue d'ensemble</h3>
                        <p className="text-gray-600">Surveillez l'activité et gérez Celebra Cameroon.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Users KPI */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-indigo-500">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">Utilisateurs Totaux</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">{kpis.totalUsers}</div>
                        </div>

                        {/* Venues KPI */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-amber-500 relative">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">Salles / Espaces</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">{kpis.totalVenues}</div>
                            {kpis.pendingVenues > 0 && (
                                <span className="absolute top-4 right-4 bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                    {kpis.pendingVenues} en attente
                                </span>
                            )}
                        </div>

                        {/* Bookings KPI */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-emerald-500">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">Réservations Validées</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">{kpis.confirmedBookingsCount} <span className="text-sm font-normal text-gray-500">/ {kpis.totalBookings} tot.</span></div>
                        </div>

                        {/* Revenue KPI */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-purple-500">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">Commissions Estimées</div>
                            <div className="mt-2 text-2xl font-bold text-gray-900">{new Intl.NumberFormat('fr-FR').format(kpis.totalCommissions)} FCFA</div>
                            <div className="text-xs text-gray-400 mt-1">Sur {new Intl.NumberFormat('fr-FR').format(kpis.totalRevenue)} FCFA de transactions</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link href={route('admin.venues')} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 flex items-center space-x-4">
                            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">Gérer les Salles</h4>
                                <p className="text-sm text-gray-500">Approuver ou rejeter les annonces</p>
                            </div>
                        </Link>

                        <Link href={route('admin.users')} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 flex items-center space-x-4">
                            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">Gérer les Utilisateurs</h4>
                                <p className="text-sm text-gray-500">Bloquer des profils frauduleux</p>
                            </div>
                        </Link>

                        <Link href={route('admin.transactions')} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 flex items-center space-x-4">
                            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">Transactions</h4>
                                <p className="text-sm text-gray-500">Voir toutes les réservations</p>
                            </div>
                        </Link>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
