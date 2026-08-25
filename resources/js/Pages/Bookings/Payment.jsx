import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLanguage } from '../../Contexts/LanguageContext';

export default function Payment({ booking }) {
    const { t } = useLanguage();
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        payment_method: 'orange_money',
        phone_number: '',
        payment_type: 'deposit' // 'deposit' or 'full'
    });

    const depositAmount = booking.total_price / 2;
    const amountToPay = data.payment_type === 'deposit' ? depositAmount : booking.total_price;

    const submit = (e) => {
        e.preventDefault();
        post(route('bookings.payment.initiate', booking.id));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{t('bookings.payment.page_title')} {booking.venue.title}</h2>}>
            <Head title={`${t('bookings.payment.page_title')} ${booking.venue.title}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 md:p-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('bookings.payment.details_title')}</h3>
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600 dark:text-gray-300">{t('bookings.payment.venue')}</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{booking.venue.title}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600 dark:text-gray-300">{t('bookings.payment.dates')}</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{t('bookings.payment.from_to').replace('{start}', booking.start_date).replace('{end}', booking.end_date)}</span>
                                    </div>
                                    <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                        <span className="font-bold text-gray-900 dark:text-white text-lg">{t('bookings.payment.total')}</span>
                                        <span className="font-black text-gray-600 dark:text-gray-400 text-xl">{new Intl.NumberFormat('fr-FR').format(booking.total_price)} FCFA</span>
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="font-bold text-gray-900 dark:text-white text-lg">{t('bookings.payment.amount_now')}</span>
                                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-xl">{new Intl.NumberFormat('fr-FR').format(amountToPay)} FCFA</span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={submit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-4">{t('bookings.payment.payment_option')}</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className={`border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${data.payment_type === 'deposit' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-emerald-500' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'}`}>
                                            <input 
                                                type="radio" 
                                                name="payment_type" 
                                                value="deposit" 
                                                className="sr-only"
                                                checked={data.payment_type === 'deposit'}
                                                onChange={e => setData('payment_type', e.target.value)}
                                            />
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg mb-1">{t('bookings.payment.deposit')}</span>
                                            <span className="font-medium text-gray-500 dark:text-gray-400 text-sm text-center">{t('bookings.payment.deposit_desc')}</span>
                                        </label>

                                        <label className={`border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${data.payment_type === 'full' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-emerald-500' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'}`}>
                                            <input 
                                                type="radio" 
                                                name="payment_type" 
                                                value="full" 
                                                className="sr-only"
                                                checked={data.payment_type === 'full'}
                                                onChange={e => setData('payment_type', e.target.value)}
                                            />
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg mb-1">{t('bookings.payment.full')}</span>
                                            <span className="font-medium text-gray-500 dark:text-gray-400 text-sm text-center">{t('bookings.payment.full_desc')}</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-4">{t('bookings.payment.choose_method')}</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className={`border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${data.payment_method === 'orange_money' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 ring-2 ring-orange-500' : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'}`}>
                                            <input 
                                                type="radio" 
                                                name="payment_method" 
                                                value="orange_money" 
                                                className="sr-only"
                                                checked={data.payment_method === 'orange_money'}
                                                onChange={e => setData('payment_method', e.target.value)}
                                            />
                                            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mb-2">OM</div>
                                            <span className="font-medium text-gray-900 dark:text-white text-sm">Orange Money</span>
                                        </label>

                                        <label className={`border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${data.payment_method === 'mtn_momo' ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 ring-2 ring-yellow-400' : 'border-gray-200 dark:border-gray-700 hover:border-yellow-300'}`}>
                                            <input 
                                                type="radio" 
                                                name="payment_method" 
                                                value="mtn_momo" 
                                                className="sr-only"
                                                checked={data.payment_method === 'mtn_momo'}
                                                onChange={e => setData('payment_method', e.target.value)}
                                            />
                                            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold mb-2">MoMo</div>
                                            <span className="font-medium text-gray-900 dark:text-white text-sm">MTN Mobile Money</span>
                                        </label>
                                    </div>
                                    {errors.payment_method && <p className="text-red-500 text-xs mt-2">{errors.payment_method}</p>}
                                </div>

                                <div className="mb-8">
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">{t('bookings.payment.phone')}</label>
                                    <input 
                                        type="tel" 
                                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500" 
                                        placeholder={t('bookings.payment.phone_placeholder')}
                                        value={data.phone_number}
                                        onChange={e => setData('phone_number', e.target.value)}
                                    />
                                    {errors.phone_number && <p className="text-red-500 text-xs mt-2">{errors.phone_number}</p>}
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50"
                                >
                                    {processing ? t('bookings.payment.processing') : t('bookings.payment.pay_now')}
                                </button>
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                                    {t('bookings.payment.secure')}
                                </p>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
