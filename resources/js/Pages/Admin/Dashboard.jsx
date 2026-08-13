import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AdminDashboard({ auth, kpis, chartData, topVenues }) {
    // Format dates for charts
    const formattedBookings = chartData.bookings.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
    }));

    const formattedRevenue = chartData.revenue.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
        revenue: parseInt(item.revenue, 10)
    }));

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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Charts */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h4 className="text-lg font-bold text-gray-900 mb-4">Évolution des réservations (30 jours)</h4>
                            <div className="h-64">
                                {formattedBookings.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={formattedBookings}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                                            <YAxis allowDecimals={false} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Area type="monotone" dataKey="count" name="Réservations" stroke="#10b981" fill="#d1fae5" strokeWidth={3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-500">Pas de données récentes</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h4 className="text-lg font-bold text-gray-900 mb-4">Revenus générés (30 jours)</h4>
                            <div className="h-64">
                                {formattedRevenue.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={formattedRevenue}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                                            <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                                            <Tooltip formatter={(value) => `${new Intl.NumberFormat('fr-FR').format(value)} FCFA`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Bar dataKey="revenue" name="Revenus" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-500">Pas de données récentes</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Top Venues */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h4 className="text-lg font-bold text-gray-900">Top Annonces (les plus réservées)</h4>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                            <th className="px-6 py-3 font-bold">Salle</th>
                                            <th className="px-6 py-3 font-bold text-center">Réservations validées</th>
                                            <th className="px-6 py-3 font-bold text-right">Prix/Jour</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {topVenues.length > 0 ? topVenues.map((venue, idx) => (
                                            <tr key={venue.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : (idx === 1 ? 'bg-gray-200 text-gray-700' : (idx === 2 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'))}`}>
                                                        #{idx + 1}
                                                    </div>
                                                    <Link href={route('admin.venues.show', venue.id)} className="font-bold text-indigo-600 hover:underline">
                                                        {venue.title}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{venue.bookings_count}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {new Intl.NumberFormat('fr-FR').format(venue.price_per_day)} FCFA
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-6 text-center text-gray-500">Aucune donnée disponible.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Quick actions */}
                        <div className="space-y-4">
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
                                    <h4 className="text-lg font-bold text-gray-900">Gérer Utilisateurs</h4>
                                    <p className="text-sm text-gray-500">Bloquer des profils, changer rôles</p>
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

                            <Link href={route('admin.settings')} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 flex items-center space-x-4">
                                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">Configuration</h4>
                                    <p className="text-sm text-gray-500">Paramètres globaux de la plateforme</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
