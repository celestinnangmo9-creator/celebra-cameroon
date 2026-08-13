import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function UserShow({ auth, user }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Détails Utilisateur : {user.name}</h2>}
        >
            <Head title={`Utilisateur - ${user.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="flex justify-between items-center">
                        <Link href={route('admin.users')} className="text-indigo-600 hover:underline">
                            &larr; Retour aux utilisateurs
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 border-b border-gray-100 flex items-center gap-6">
                            <div className="h-24 w-24 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-3xl font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{user.name}</h3>
                                <p className="text-gray-500">{user.email}</p>
                                <div className="mt-2 flex gap-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase bg-gray-100 text-gray-800">
                                        Rôle : {user.role}
                                    </span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${user.status === 'active' || !user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                    `}>
                                        Statut : {user.status === 'active' || !user.status ? 'Actif' : 'Bloqué'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Téléphone</p>
                                <p>{user.phone || 'Non renseigné'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Date d'inscription</p>
                                <p>{new Date(user.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Venues Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold">Salles créées ({user.venues.length})</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                        <th className="px-6 py-4 font-bold">Titre</th>
                                        <th className="px-6 py-4 font-bold">Statut</th>
                                        <th className="px-6 py-4 font-bold">Prix</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {user.venues.length > 0 ? user.venues.map(venue => (
                                        <tr key={venue.id}>
                                            <td className="px-6 py-4 font-medium"><Link href={route('venues.show', venue.id)} className="text-indigo-600 hover:underline">{venue.title}</Link></td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase
                                                    ${venue.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                                    ${venue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    ${venue.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                                `}>
                                                    {venue.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{venue.price_per_day} FCFA / jour</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">Aucune salle créée.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold">Réservations effectuées ({user.bookings.length})</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                        <th className="px-6 py-4 font-bold">Salle</th>
                                        <th className="px-6 py-4 font-bold">Dates</th>
                                        <th className="px-6 py-4 font-bold">Statut</th>
                                        <th className="px-6 py-4 font-bold">Prix Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {user.bookings.length > 0 ? user.bookings.map(booking => (
                                        <tr key={booking.id}>
                                            <td className="px-6 py-4 font-medium"><Link href={route('venues.show', booking.venue_id)} className="text-indigo-600 hover:underline">{booking.venue?.title}</Link></td>
                                            <td className="px-6 py-4">Du {new Date(booking.start_date).toLocaleDateString()} au {new Date(booking.end_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase bg-gray-100 text-gray-800">
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold">{booking.total_price} FCFA</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Aucune réservation effectuée.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
