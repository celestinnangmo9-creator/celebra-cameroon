import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function ErrorPage({ status }) {
    const { t } = useLanguage();
    const title = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
    }[status] || 'Error';

    const description = {
        503: t('errors.503'),
        500: t('errors.500'),
        404: t('errors.404'),
        403: t('errors.403'),
    }[status] || 'Une erreur inattendue est survenue.';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Head title={title} />
            <div className="max-w-xl w-full bg-white shadow-xl rounded-lg p-8 text-center border-t-4 border-[#0B3D2E]">
                <h1 className="text-6xl font-bold text-[#C9A227] mb-4 font-serif">{status}</h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
                <p className="text-gray-600 mb-8">{description}</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={() => window.history.back()} className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
                        Retour
                    </button>
                    <Link href="/" className="px-6 py-2 bg-[#0B3D2E] text-white rounded hover:bg-[#082a20] transition-colors">
                        Accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
