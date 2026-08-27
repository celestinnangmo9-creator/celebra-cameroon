import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function FavoritesIndex({ auth, favorites }) {
    const { t } = useLanguage();
    const { post } = useForm();

    const toggleFavorite = (venueId) => {
        post(route('favorites.toggle', venueId), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mes Espaces Favoris</h2>}
        >
            <Head title="Mes Favoris" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            <i className="fa-solid fa-heart text-red-500 mr-2"></i> 
                            Vos coups de cœur
                        </h1>
                        <p className="text-gray-600">Retrouvez ici tous les espaces que vous avez sauvegardés.</p>
                    </div>

                    {favorites.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl text-center border border-gray-100 shadow-sm">
                            <i className="fa-regular fa-heart text-5xl text-gray-300 mb-4"></i>
                            <h3 className="text-xl font-bold text-gray-800">Vous n'avez pas encore de favoris</h3>
                            <p className="text-gray-500 mt-2">Explorez notre catalogue et ajoutez des lieux à vos favoris pour les retrouver facilement.</p>
                            <Link href={route('venues.index')} className="inline-block mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors">
                                Explorer les espaces
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map(favorite => (
                                <div key={favorite.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all relative">
                                    <button 
                                        onClick={() => toggleFavorite(favorite.venue.id)}
                                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:scale-110 hover:bg-white transition-all shadow-sm"
                                        title="Retirer des favoris"
                                    >
                                        <i className="fa-solid fa-heart"></i>
                                    </button>
                                    
                                    <Link href={route('venues.show', favorite.venue.id)} className="block h-48 overflow-hidden">
                                        <img src={favorite.venue.main_image} alt={favorite.venue.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </Link>
                                    
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-xs text-emerald-600 font-bold uppercase">{favorite.venue.city}</div>

                                        </div>
                                        <h4 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{favorite.venue.title}</h4>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{favorite.venue.description}</p>
                                        
                                        <div className="flex items-end justify-between mt-auto">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">À partir de</div>
                                                <div className="font-black text-gray-900 text-xl">{new Intl.NumberFormat('fr-FR').format(favorite.venue.price_per_day)} <span className="text-sm font-medium text-gray-500">FCFA</span></div>
                                            </div>
                                            <Link href={route('venues.show', favorite.venue.id)} className="bg-gray-100 hover:bg-emerald-50 hover:text-emerald-600 text-gray-700 p-2 rounded-lg transition-colors">
                                                <i className="fa-solid fa-arrow-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
