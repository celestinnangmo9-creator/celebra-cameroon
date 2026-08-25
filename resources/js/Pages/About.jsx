import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useLanguage } from '../Contexts/LanguageContext';

export default function About() {
    const { t } = useLanguage();
    return (
        <PublicLayout>
            <Head title={t('about.page_title')} />
            
            <div className="bg-emerald-600 text-white py-20 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-black mb-4">{t('about.title')}</h1>
                <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto">{t('about.subtitle')}</p>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-gray-700 leading-relaxed space-y-6">
                    <p className="text-lg">
                        {t('about.p1')}
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('about.mission_title')}</h2>
                    <p>
                        {t('about.mission_text')}
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
