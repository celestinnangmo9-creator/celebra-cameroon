import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, userRole, userVenues, totalVenues, totalBookings, totalRevenue, pendingBookingsCount, recentBookings, upcomingAppointments, venuePerformances }) {
    
    // Rendu pour l'Hôte (Propriétaire)
    const renderHostDashboard = () => (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Aperçu Global</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gérez vos espaces et suivez vos revenus au Cameroun.</p>
                </div>
                <a href={route('venues.create')} className="inline-flex items-center rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-1 hover:bg-amber-700 hover:shadow-amber-600/40">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Ajouter un espace
                </a>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenus Validés</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{new Intl.NumberFormat('fr-FR').format(totalRevenue)} FCFA</p>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mes Espaces</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalVenues}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Réservations Totales</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalBookings}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">En attente</p>
                        <p className="text-2xl font-bold text-rose-600">{pendingBookingsCount}</p>
                    </div>
                </div>
            </div>

            {/* Performances des Salles */}
            {venuePerformances && venuePerformances.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 mb-6 mt-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Mes Salles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {venuePerformances.map(venue => (
                            <div key={venue.id} className="border border-gray-100 dark:border-gray-700 p-4 rounded-xl flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{venue.title}</h4>
                                    <p className="text-xs text-gray-500">{venue.city} • {venue.bookings_count} réservations</p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('venues.edit', venue.id)} className="bg-gray-50 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-bold text-xs flex items-center gap-1">
                                        <i className="fa-solid fa-pen"></i> Modifier
                                    </Link>
                                    <Link href={route('venues.stats', venue.id)} className="bg-emerald-50 text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors font-bold text-xs flex items-center gap-1">
                                        <i className="fa-solid fa-chart-pie"></i> Stats / Calendrier
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Table des Réservations Récentes */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Dernières Demandes de Réservation</h3>
                    <Link href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">Voir tout</Link>
                </div>
                
                {recentBookings && recentBookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    <th className="px-6 py-4 font-semibold">Client (Informations)</th>
                                    <th className="px-6 py-4 font-semibold">Espace Réservé</th>
                                    <th className="px-6 py-4 font-semibold">Période</th>
                                    <th className="px-6 py-4 font-semibold">Montant Total</th>
                                    <th className="px-6 py-4 font-semibold">Statut</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                {recentBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                                                    {booking.user?.name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900 dark:text-white">{booking.user?.name}</div>
                                                    <div className="text-sm text-gray-500">{booking.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{booking.venue?.title}</div>
                                            <div className="text-sm text-gray-500">{booking.venue?.city}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-white">Du {new Date(booking.start_date).toLocaleDateString('fr-FR')}</div>
                                            <div className="text-sm text-gray-500">Au {new Date(booking.end_date).toLocaleDateString('fr-FR')}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-amber-600 dark:text-amber-500">{new Intl.NumberFormat('fr-FR').format(booking.total_price)} FCFA</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                                                ${booking.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                                                ${booking.status === 'cancelled' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' : ''}
                                            `}>
                                                {booking.status === 'confirmed' ? 'Confirmé' : (booking.status === 'pending' ? 'En attente' : 'Annulé')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <button className="text-emerald-600 hover:text-emerald-900 dark:hover:text-emerald-400 mr-3">Gérer</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        Aucune réservation récente.
                    </div>
                )}
            </div>
        </div>
    );

    // Rendu pour le Client
    const renderClientDashboard = () => (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bienvenue, {auth.user.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Retrouvez l'historique de vos réservations et vos visites planifiées.</p>
                </div>
                <a href="/" className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-emerald-600/40">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    Rechercher une salle
                </a>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune réservation pour le moment</h3>
                <p className="mt-1 text-sm text-gray-500">Commencez par explorer nos salles exceptionnelles au Cameroun.</p>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Tableau de bord
                </h2>
            }
        >
            <Head title="Tableau de bord" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {userRole === 'host' || userRole === 'admin' ? renderHostDashboard() : renderClientDashboard()}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
