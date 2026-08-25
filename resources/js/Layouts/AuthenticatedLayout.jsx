import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import MobileBottomNav from '@/Components/MobileBottomNav';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { UnreadMessagesProvider, useUnreadMessages } from '@/Contexts/UnreadMessagesContext';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useLanguage } from '../Contexts/LanguageContext';

function LayoutContent({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const { totalUnread, latestMessageToast } = useUnreadMessages();
    const { t } = useLanguage();

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const [isDarkMode, setIsDarkMode] = useState(
        typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
    );

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    const isSubscriptionExpired = user?.role === 'host' && user?.subscription_status === 'expired';
    const isSubscriptionPage = route().current('subscriptions.*');

    return (
        <div className={`bg-gray-100 dark:bg-gray-900 overflow-x-hidden w-full ${route().current('messages.*') ? 'fixed inset-0 w-full flex flex-col overflow-hidden' : 'min-h-screen flex flex-col'}`}>
            {/* Flash Messages */}
            {(flash?.success || flash?.error || flash?.message) && (
                <div className="fixed top-24 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                    {flash.success && (
                        <div className="bg-emerald-100 border-l-4 border-emerald-500 text-emerald-800 px-5 py-4 rounded shadow-lg flex items-center gap-3 pointer-events-auto">
                            <i className="fa-solid fa-circle-check text-emerald-600 text-xl"></i>
                            <div className="font-medium">{flash.success}</div>
                        </div>
                    )}
                    {flash.error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 px-5 py-4 rounded shadow-lg flex items-center gap-3 pointer-events-auto">
                            <i className="fa-solid fa-triangle-exclamation text-red-600 text-xl"></i>
                            <div className="font-medium">{flash.error}</div>
                        </div>
                    )}
                    {flash.message && (
                        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 px-5 py-4 rounded shadow-lg flex items-center gap-3 pointer-events-auto">
                            <i className="fa-solid fa-circle-info text-blue-600 text-xl"></i>
                            <div className="font-medium">{flash.message}</div>
                        </div>
                    )}
                </div>
            )}
            
            {/* Nouveau Message Toast */}
            {latestMessageToast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none animate-bounce">
                    <Link href={route('messages.index')} className="bg-[#0B3D2E] text-[#FAF6F0] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 pointer-events-auto border border-[#C9A227] hover:bg-[#124d3a] transition-all">
                        <i className="fa-solid fa-comment-dots text-[#C9A227] text-xl"></i>
                        <div className="font-medium">Nouveau message reçu !</div>
                    </Link>
                </div>
            )}

            <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800 shrink-0">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <a href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </a>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('home')}
                                    active={route().current('home')}
                                >
                                    <i className="fa-solid fa-house mr-2"></i> Accueil
                                </NavLink>
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                                {user?.role === 'host' && (
                                    <>
                                        <NavLink
                                            href={route('host.appointments.index')}
                                            active={route().current('host.appointments.*')}
                                        >
                                            Rendez-vous
                                            {auth.pending_appointments_count > 0 && (
                                                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-orange-500 rounded-full">
                                                    {auth.pending_appointments_count}
                                                </span>
                                            )}
                                        </NavLink>
                                        <NavLink
                                            href={route('subscriptions.index')}
                                            active={route().current('subscriptions.*')}
                                            className="text-[#C9A227] font-bold"
                                        >
                                            <i className="fa-solid fa-crown mr-2"></i> Abonnement
                                        </NavLink>
                                    </>
                                )}
                                {user?.role === 'admin' && (
                                    <NavLink
                                        href={route('admin.dashboard')}
                                        active={route().current('admin.*')}
                                        className="text-purple-600 font-bold"
                                    >
                                        Administration
                                    </NavLink>
                                )}
                                <NavLink
                                    href={route('messages.index')}
                                    active={route().current('messages.*')}
                                >
                                    <i className="fa-solid fa-comments mr-2"></i> Messages
                                    {totalUnread > 0 && (
                                        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                            {totalUnread}
                                        </span>
                                    )}
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="flex items-center gap-2">
                                <LanguageSwitcher />

                                <button 
                                    className="btn btn-ghost w-10 h-10 rounded-full p-0 flex items-center justify-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800" 
                                    title={t('nav.toggle_theme', 'Basculer le mode sombre/clair')} 
                                    onClick={toggleDarkMode}
                                >
                                    <i className={`fa-solid ${isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon text-gray-700 dark:text-gray-300'}`}></i>
                                </button>
                            </div>

                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md relative mr-4">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                            >
                                                <i className="fa-solid fa-bell text-lg"></i>
                                                {auth.unread_notifications?.length > 0 && (
                                                    <span className="absolute top-1 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                                        {auth.unread_notifications.length}
                                                    </span>
                                                )}
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content width="w-80">
                                        <div className="p-3 text-sm font-bold border-b border-gray-100 flex justify-between items-center text-gray-800">
                                            <span>Notifications</span>
                                            {auth.unread_notifications?.length > 0 && (
                                                <Link href={route('notifications.markRead')} method="post" as="button" className="text-xs text-emerald-600 font-medium hover:underline">
                                                    Marquer lu
                                                </Link>
                                            )}
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {auth.unread_notifications?.length > 0 ? (
                                                auth.unread_notifications.map(notif => (
                                                    <div key={notif.id} className="p-3 border-b border-gray-50 hover:bg-gray-50 flex flex-col gap-1">
                                                        <span className="text-xs font-bold text-gray-500">{new Date(notif.created_at).toLocaleString()}</span>
                                                        <span className="text-sm text-gray-700">{notif.data.message}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-gray-500 text-sm">
                                                    Aucune nouvelle notification
                                                </div>
                                            )}
                                        </div>
                                    </Dropdown.Content>
                                </Dropdown>

                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('home')}
                            active={route().current('home')}
                        >
                            <i className="fa-solid fa-house mr-2"></i> Accueil
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        {user?.role === 'host' && (
                            <>
                                <ResponsiveNavLink
                                    href={route('host.appointments.index')}
                                    active={route().current('host.appointments.*')}
                                >
                                    Rendez-vous
                                    {auth.pending_appointments_count > 0 && (
                                        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-orange-500 rounded-full">
                                            {auth.pending_appointments_count}
                                        </span>
                                    )}
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('subscriptions.index')}
                                    active={route().current('subscriptions.*')}
                                    className="text-[#C9A227] font-bold"
                                >
                                    <i className="fa-solid fa-crown mr-2"></i> Abonnement
                                </ResponsiveNavLink>
                            </>
                        )}
                        {user?.role === 'admin' && (
                            <ResponsiveNavLink
                                href={route('admin.dashboard')}
                                active={route().current('admin.*')}
                                className="text-purple-600 font-bold"
                            >
                                Administration
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow dark:bg-gray-800 shrink-0">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className={route().current('messages.*') ? "flex-1 overflow-hidden flex flex-col relative" : "flex-1 flex flex-col pb-24 md:pb-0"}>
                {children}
            </main>

            {/* Expired Subscription Blocking Modal */}
            {isSubscriptionExpired && !isSubscriptionPage && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center border-t-4 border-red-500">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                            <i className="fa-solid fa-lock text-red-600 text-2xl"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-['Fraunces']">
                            Abonnement expiré
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                            Votre période d'essai ou votre abonnement a expiré. Vos salles sont actuellement masquées. 
                            Veuillez choisir une formule d'abonnement pour continuer à gérer vos salles et les rendre visibles à nouveau.
                        </p>
                        <Link
                            href={route('subscriptions.index')}
                            className="inline-flex justify-center items-center px-6 py-3 bg-[#0B3D2E] hover:bg-[#124d3a] text-white font-bold rounded-lg shadow-lg transition-all border border-[#C9A227] hover:scale-105 w-full"
                        >
                            <i className="fa-solid fa-crown mr-2 text-[#C9A227]"></i>
                            Voir les formules d'abonnement
                        </Link>
                    </div>
                </div>
            )}

            {!route().current('messages.*') && <MobileBottomNav />}
        </div>
    );
}

export default function AuthenticatedLayout(props) {
    return (
        <UnreadMessagesProvider>
            <LayoutContent {...props} />
        </UnreadMessagesProvider>
    );
}
