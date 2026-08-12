import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Contact() {
    return (
        <PublicLayout>
            <Head title="Contact - Celebra Cameroon" />
            
            <div className="bg-emerald-600 text-white py-20 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-black mb-4">Contactez-nous</h1>
                <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto">Une question ? Un problème ? Notre équipe est à votre disposition.</p>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos Coordonnées</h2>
                        <div className="space-y-6 text-gray-700">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 text-xl">
                                    <i className="fa-solid fa-phone"></i>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">Téléphone</div>
                                    <div className="font-semibold">+237 696675924</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 text-xl">
                                    <i className="fa-solid fa-envelope"></i>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">Email</div>
                                    <div className="font-semibold">celestinnangmo9@gmail.com</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 text-xl">
                                    <i className="fa-solid fa-location-dot"></i>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">Adresse</div>
                                    <div className="font-semibold">Akwa, Douala - Cameroun</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nom complet</label>
                                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Votre nom" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-emerald-500 focus:border-emerald-500" placeholder="votre@email.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                                <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-emerald-500 focus:border-emerald-500 h-32" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                            </div>
                            <button type="button" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-emerald-500/30">
                                Envoyer le message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
