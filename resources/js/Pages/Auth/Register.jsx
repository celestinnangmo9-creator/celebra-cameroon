import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useLanguage } from '../../Contexts/LanguageContext';

export default function Register() {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'client',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t('auth.register.page_title')} />

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('auth.register.title')}</h2>
                <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">{t('auth.register.subtitle')}</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="name" value={t('auth.register.name')} />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        placeholder={t('auth.register.name_placeholder')}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value={t('auth.register.email')} />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        placeholder={t('auth.register.email_placeholder')}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <InputLabel htmlFor="password" value={t('auth.register.password')} />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value={t('auth.register.confirm_password')}
                        />

                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="role" value={t('auth.register.role_label')} />

                    <div className="relative mt-1">
                        <select
                            id="role"
                            name="role"
                            value={data.role}
                            className="w-full appearance-none rounded-xl border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                            onChange={(e) => setData('role', e.target.value)}
                            required
                        >
                            <option value="client">{t('auth.register.role_client')}</option>
                            <option value="host">{t('auth.register.role_host')}</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>

                    <InputError message={errors.role} className="mt-2" />
                </div>

                <div className="pt-2 flex items-center justify-between">
                    <Link
                        href={route('login')}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 transition-colors"
                    >
                        {t('auth.register.already_registered')}
                    </Link>

                    <PrimaryButton disabled={processing}>
                        {t('auth.register.register_btn')}
                    </PrimaryButton>
                </div>

                <div className="mt-6 flex items-center justify-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('auth.register.or')}</span>
                </div>

                <div className="mt-4">
                    <a
                        href={route('google.redirect')}
                        className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-700"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                            <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                            <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                            <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                        </svg>
                        {t('auth.register.register_google')}
                    </a>
                </div>
            </form>
        </GuestLayout>
    );
}
