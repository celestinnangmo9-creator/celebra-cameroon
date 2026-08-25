import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useLanguage } from '../../../Contexts/LanguageContext';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const { t } = useLanguage();
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            _method: 'patch',
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            bio: user.bio || '',
            avatar: null,
        });

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'), { preserveScroll: true, forceFormData: true });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {t('profile.information.title')}
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {t('profile.information.description')}
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar preview */}
                    <div className="shrink-0 flex flex-col items-center gap-3">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center">
                            {data.avatar ? (
                                <img src={URL.createObjectURL(data.avatar)} className="w-full h-full object-cover" />
                            ) : user.avatar ? (
                                <img src={`/storage/${user.avatar}`} className="w-full h-full object-cover" />
                            ) : (
                                <i className="fa-solid fa-user text-3xl text-gray-300"></i>
                            )}
                        </div>
                        <label className="cursor-pointer bg-white border border-gray-300 hover:border-emerald-500 hover:text-emerald-600 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                            <span>{t('profile.information.change_photo')}</span>
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={e => setData('avatar', e.target.files[0])}
                            />
                        </label>
                        <InputError className="mt-1 text-center" message={errors.avatar} />
                    </div>

                    <div className="grow space-y-6">
                        <div>
                            <InputLabel htmlFor="name" value={t('profile.information.name')} />
                            <TextInput
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                isFocused
                                autoComplete="name"
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value={t('profile.information.email')} />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div>
                            <InputLabel htmlFor="phone" value={t('profile.information.phone')} />
                            <TextInput
                                id="phone"
                                type="tel"
                                className="mt-1 block w-full"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder={t('profile.information.phone_placeholder')}
                            />
                            <InputError className="mt-2" message={errors.phone} />
                        </div>

                        <div>
                            <InputLabel htmlFor="bio" value={t('profile.information.bio')} />
                            <textarea
                                id="bio"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                value={data.bio}
                                rows="3"
                                onChange={(e) => setData('bio', e.target.value)}
                                placeholder={t('profile.information.bio_placeholder')}
                            ></textarea>
                            <InputError className="mt-2" message={errors.bio} />
                        </div>
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            {t('profile.information.unverified')}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            >
                                {t('profile.information.resend')}
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                {t('profile.information.sent')}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>{t('profile.information.save')}</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('profile.information.saved')}
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
