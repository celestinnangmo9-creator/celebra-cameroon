import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLanguage } from '../../Contexts/LanguageContext';

export default function MockPayment({ booking, transaction_id }) {
    const { t } = useLanguage();
    const { auth } = usePage().props;
    const { data, setData, post, processing } = useForm({
        status: 'successful',
        transaction_id: transaction_id
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('bookings.payment.processMock', booking.id));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{t('bookings.payment.simulation_title')}</h2>}>
            <Head title={t('bookings.payment.simulation_title')} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 md:p-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4 text-2xl">
                                    <i className="fa-solid fa-mobile-screen"></i>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('bookings.payment.ussd_title')}</h3>
                                <p className="text-gray-500 mt-2">
                                    {t('bookings.payment.ussd_desc')}
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-8">
                                <p className="text-center font-mono text-sm text-gray-600 dark:text-gray-300">
                                    Transaction ID: <strong>{transaction_id}</strong><br/>
                                    {t('bookings.payment.amount')} <strong>{new Intl.NumberFormat('fr-FR').format(booking.total_price)} FCFA</strong>
                                </p>
                            </div>

                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <button 
                                    type="submit" 
                                    onClick={() => setData('status', 'successful')}
                                    disabled={processing}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
                                >
                                    {t('bookings.payment.sim_success')}
                                </button>

                                <button 
                                    type="submit" 
                                    onClick={() => setData('status', 'failed')}
                                    disabled={processing}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
                                >
                                    {t('bookings.payment.sim_failed')}
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
