import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function About() {
    return (
        <PublicLayout>
            <Head title="À Propos - Celebra Cameroon" />
            
            <div className="bg-emerald-600 text-white py-20 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-black mb-4">À Propos de Celebra Cameroon</h1>
                <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto">La plateforme révolutionnaire qui simplifie l'organisation d'événements au Cameroun.</p>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-gray-700 leading-relaxed space-y-6">
                    <p className="text-lg">
                        Celebra Cameroon est née d'une vision simple : rendre la recherche et la réservation de salles d'événement aussi faciles et transparentes que possible.
                    </p>
                    <p>
                        Que ce soit pour un mariage grandiose à Douala, une conférence professionnelle à Yaoundé, ou une petite fête privée à Kribi, notre plateforme centralise les meilleurs lieux du pays.
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Notre Mission</h2>
                    <p>
                        Connecter les organisateurs d'événements avec les propriétaires d'espaces, tout en offrant une expérience utilisateur fluide, sécurisée et digne des standards internationaux.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
