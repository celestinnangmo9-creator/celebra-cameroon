import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AdminTransactions({ auth, bookings }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Historique des Transactions</h2>}
        >
            <Head title="Admin - Transactions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold">Toutes les réservations ({bookings.total})</h3>
                            <Link href={route('admin.dashboard')} className="text-sm text-indigo-600 hover:underline">
                                &larr; Retour au Dashboard
                            </Link>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                        <th className="px-6 py-4 font-bold">Réf / Date</th>
                                        <th className="px-6 py-4 font-bold">Client</th>
                                        <th className="px-6 py-4 font-bold">Salle</th>
                                        <th className="px-6 py-4 font-bold">Montant</th>
                                        <th className="px-6 py-4 font-bold">Commission (10%)</th>
                                        <th className="px-6 py-4 font-bold">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {bookings.data.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-mono text-gray-900">#RES-{booking.id.toString().padStart(4, '0')}</div>
                                                <div className="text-xs text-gray-500 mt-1">{new Date(booking.created_at).toLocaleDateString('fr-FR')}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{booking.user?.name}</div>
                                                <div className="text-xs text-gray-500">{booking.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <a href={route('venues.show', booking.venue?.id)} className="font-bold text-indigo-600 hover:underline text-sm block break-words max-w-[15rem]">
                                                    {booking.venue?.title}
                                                </a>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Du {new Date(booking.start_date).toLocaleDateString('fr-FR')} au {new Date(booking.end_date).toLocaleDateString('fr-FR')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900">{new Intl.NumberFormat('fr-FR').format(booking.total_price)} FCFA</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-emerald-600">+{new Intl.NumberFormat('fr-FR').format(booking.total_price * 0.10)} FCFA</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase
                                                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                                                    ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                                `}>
                                                    {booking.status === 'confirmed' ? 'Confirmé' : (booking.status === 'pending' ? 'En attente' : 'Annulé')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="p-4 border-t border-gray-200">
                            <div className="text-sm text-gray-500 text-center">
                                Affichage de {bookings.data.length} transactions.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
