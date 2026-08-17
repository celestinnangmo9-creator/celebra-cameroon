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
                        Celebra Cameroon est la plateforme de référence pour la réservation d'espaces événementiels au Cameroun. Nous mettons en relation les organisateurs d'événements avec un réseau soigneusement sélectionné de salles de fêtes et de prestataires à travers le pays, en offrant une expérience de réservation fluide, transparente et digne de confiance.
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Notre Mission</h2>
                    <p>
                        Notre ambition est de transformer l'organisation d'événements au Cameroun en simplifiant l'accès aux meilleurs espaces disponibles, tout en valorisant le savoir-faire des propriétaires et prestataires locaux.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
