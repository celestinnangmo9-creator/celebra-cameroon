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

function SidebarItem({ href, active, icon, children, badge }) {
    return (
        <Link
            href={href}
            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                active
                    ? 'bg-[#0B3D2E] text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-emerald-50 hover:text-[#0B3D2E] dark:hover:bg-gray-700/50 dark:hover:text-white'
            }`}
        >
            <div className={`w-6 h-6 flex items-center justify-center mr-3 ${active ? 'text-[#C9A227]' : 'text-gray-400 group-hover:text-[#0B3D2E] dark:group-hover:text-emerald-400'}`}>
                {icon}
            </div>
            <span className="font-semibold">{children}</span>
            {badge && (
                <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {badge}
                </span>
            )}
        </Link>
    );
}

function SidebarContent({ user, auth, totalUnread, t }) {
    return (
        <>
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-center shrink-0">
                <Link href={route('home')}>
                    <ApplicationLogo className="h-10 w-auto" />
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
                <SidebarItem href={route('dashboard')} active={route().current('dashboard')} icon={<i className="fa-solid fa-chart-pie"></i>}>
                    {t('layouts.dashboard')}
                </SidebarItem>

                {user?.role === 'host' && (
                    <>
                        <SidebarItem href={route('host.venues.index')} active={route().current('host.venues.*')} icon={<i className="fa-solid fa-building"></i>}>
                            {t('layouts.my_venues')}
                        </SidebarItem>
                        <SidebarItem href={route('host.reservations.index')} active={route().current('host.reservations.*')} icon={<i className="fa-solid fa-calendar-alt"></i>}>
                            {t('layouts.reservations')}
                        </SidebarItem>
                        <SidebarItem href={route('host.appointments.index')} active={route().current('host.appointments.*')} icon={<i className="fa-solid fa-calendar-check"></i>} badge={auth.pending_appointments_count > 0 ? auth.pending_appointments_count : null}>
                            {t('layouts.appointments')}
                        </SidebarItem>
                        <SidebarItem href={route('subscriptions.index')} active={route().current('subscriptions.*')} icon={<i className="fa-solid fa-crown text-amber-500"></i>}>
                            {t('layouts.subscription')}
                        </SidebarItem>
                    </>
                )}

                {user?.role === 'admin' && (
                    <>
                        <SidebarItem href={route('admin.dashboard')} active={route().current('admin.dashboard')} icon={<i className="fa-solid fa-chart-line"></i>}>
                            {t('layouts.admin')}
                        </SidebarItem>
                        <SidebarItem href={route('admin.users')} active={route().current('admin.users')} icon={<i className="fa-solid fa-users"></i>}>
                            {t('layouts.admin_users')}
                        </SidebarItem>
                        <SidebarItem href={route('admin.venues')} active={route().current('admin.venues')} icon={<i className="fa-solid fa-building"></i>}>
                            {t('layouts.admin_venues')}
                        </SidebarItem>
                        <SidebarItem href={route('admin.transactions')} active={route().current('admin.transactions')} icon={<i className="fa-solid fa-money-bill-transfer"></i>}>
                            {t('layouts.admin_transactions')}
                        </SidebarItem>
                        <SidebarItem href={route('admin.subscriptions')} active={route().current('admin.subscriptions')} icon={<i className="fa-solid fa-crown text-amber-500"></i>}>
                            {t('layouts.admin_subscriptions')}
                        </SidebarItem>
                        <SidebarItem href={route('admin.settings')} active={route().current('admin.settings')} icon={<i className="fa-solid fa-gear"></i>}>
                            {t('layouts.admin_settings')}
                        </SidebarItem>
                    </>
                )}

                <SidebarItem href={route('client.reservations.index')} active={route().current('client.reservations.*')} icon={<i className="fa-solid fa-calendar-alt"></i>}>
                    {t('layouts.my_reservations')}
                </SidebarItem>

                <SidebarItem href={route('messages.index')} active={route().current('messages.*')} icon={<i className="fa-solid fa-comments"></i>} badge={totalUnread > 0 ? totalUnread : null}>
                    {t('layouts.messages')}
                </SidebarItem>

                <SidebarItem href={route('favorites.index')} active={route().current('favorites.*')} icon={<i className="fa-solid fa-heart text-red-500"></i>}>
                    Mes Favoris
                </SidebarItem>
                
                <SidebarItem href={route('profile.edit')} active={route().current('profile.edit')} icon={<i className="fa-solid fa-user-gear"></i>}>
                    {t('layouts.settings')}
                </SidebarItem>
            </div>

            {/* User Profile Mini (Bottom of Sidebar) */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold overflow-hidden shadow-sm shrink-0">
                        {user.avatar ? (
                            <img src={user.avatar.startsWith('http') || user.avatar.startsWith('/') ? user.avatar : `/storage/${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            user.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{user.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                    </div>
                    <Link href={route('logout')} method="post" as="button" className="p-2 text-gray-400 hover:text-red-500 transition-colors" title={t('layouts.logout')}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </Link>
                </div>
            </div>
        </>
    );
}

function LayoutContent({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const { totalUnread, latestMessageToast } = useUnreadMessages();
    const { t } = useLanguage();

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(
        typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
    );

    const [visibleFlash, setVisibleFlash] = useState(flash);

    useEffect(() => {
        setVisibleFlash(flash);
        if (flash?.success || flash?.error || flash?.message) {
            const timer = setTimeout(() => {
                setVisibleFlash({ success: null, error: null, message: null });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

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
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans w-full">
            {/* Flash Messages */}
            {(visibleFlash?.success || visibleFlash?.error || visibleFlash?.message) && (
                <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                    {visibleFlash.success && (
                        <div className="bg-emerald-100 border-l-4 border-emerald-500 text-emerald-800 px-5 py-4 rounded shadow-lg flex items-center gap-3 pointer-events-auto">
                            <i className="fa-solid fa-circle-check text-emerald-600 text-xl"></i>
                            <div className="font-medium">{visibleFlash.success}</div>
                        </div>
                    )}
                    {visibleFlash.error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 px-5 py-4 rounded shadow-lg flex items-center gap-3 pointer-events-auto">
                            <i className="fa-solid fa-triangle-exclamation text-red-600 text-xl"></i>
                            <div className="font-medium">{visibleFlash.error}</div>
                        </div>
                    )}
                    {visibleFlash.message && (
                        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 px-5 py-4 rounded shadow-lg flex items-center gap-3 pointer-events-auto">
                            <i className="fa-solid fa-circle-info text-blue-600 text-xl"></i>
                            <div className="font-medium">{visibleFlash.message}</div>
                        </div>
                    )}
                </div>
            )}
            
            {latestMessageToast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none animate-bounce">
                    <Link href={route('messages.index')} className="bg-[#0B3D2E] text-[#FAF6F0] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 pointer-events-auto border border-[#C9A227] hover:bg-[#124d3a] transition-all">
                        <i className="fa-solid fa-comment-dots text-[#C9A227] text-xl"></i>
                        <div className="font-medium">{t('layouts.new_message_toast')}</div>
                    </Link>
                </div>
            )}

            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 h-full shrink-0 shadow-sm z-20">
                <SidebarContent user={user} auth={auth} totalUnread={totalUnread} t={t} />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {showingNavigationDropdown && (
                <div 
                    className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden transition-opacity"
                    onClick={() => setShowingNavigationDropdown(false)}
                ></div>
            )}

            {/* Mobile Sidebar Drawer */}
            <div 
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col md:hidden ${
                    showingNavigationDropdown ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex justify-end p-4 absolute top-0 right-0">
                    <button 
                        onClick={() => setShowingNavigationDropdown(false)}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>
                <SidebarContent user={user} auth={auth} totalUnread={totalUnread} t={t} />
            </div>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 shrink-0 h-16 flex items-center px-4 sm:px-6 lg:px-8 z-10">
                    
                    {/* Mobile Logo & Hamburger */}
                    <div className="flex md:hidden items-center mr-4">
                        <Link href={route('home')}>
                            <ApplicationLogo className="h-8 w-auto" />
                        </Link>
                    </div>

                    {/* Page Title (Desktop) */}
                    <div className="hidden md:block text-xl font-semibold text-gray-800 dark:text-gray-200">
                        {header}
                    </div>

                    {/* Global Actions (Right aligned) */}
                    <div className="flex items-center gap-3 ml-auto">
                        <LanguageSwitcher />

                        <button 
                            className="btn btn-ghost w-10 h-10 rounded-full p-0 flex items-center justify-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400" 
                            title={t('nav.toggle_theme', 'Basculer le mode sombre/clair')} 
                            onClick={toggleDarkMode}
                        >
                            <i className={`fa-solid ${isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon text-gray-600 dark:text-gray-300'}`}></i>
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md relative">
                                        <button
                                            type="button"
                                            className="w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none"
                                        >
                                            <i className="fa-solid fa-bell text-lg"></i>
                                            {auth.unread_notifications?.length > 0 && (
                                                <span className="absolute top-1 right-1 flex items-center justify-center h-4 w-4 text-[10px] font-bold text-white bg-red-600 border border-white dark:border-gray-800 rounded-full">
                                                    {auth.unread_notifications.length}
                                                </span>
                                            )}
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content width="w-80">
                                    <div className="p-3 text-sm font-bold border-b border-gray-100 dark:border-gray-700 flex justify-between items-center text-gray-800 dark:text-gray-200">
                                        <span>{t('layouts.notifications')}</span>
                                        {auth.unread_notifications?.length > 0 && (
                                            <Link href={route('notifications.markRead')} method="post" as="button" className="text-xs text-emerald-600 font-medium hover:underline">
                                                {t('layouts.mark_read')}
                                            </Link>
                                        )}
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {auth.unread_notifications?.length > 0 ? (
                                            auth.unread_notifications.map(notif => (
                                                <div key={notif.id} className="p-3 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex flex-col gap-1 transition-colors">
                                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{new Date(notif.created_at).toLocaleString()}</span>
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">{notif.data.message}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500 text-sm">
                                                {t('layouts.no_notifications')}
                                            </div>
                                        )}
                                    </div>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                        
                        {/* Mobile User Toggle */}
                        <div className="-me-2 flex items-center md:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-400"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main scrollable area */}
                <main className={`flex-1 overflow-y-auto ${route().current('messages.*') ? 'p-0 relative flex flex-col bg-white dark:bg-gray-900 h-full' : 'p-4 md:p-8 pb-24 md:pb-8'}`}>
                    {/* Mobile Page Header */}
                    <div className="md:hidden mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
                        {header}
                    </div>
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
                                {t('layouts.expired_title')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                {t('layouts.expired_desc')}
                            </p>
                            <Link href={route('subscriptions.index')} className="inline-flex justify-center items-center px-6 py-3 bg-[#0B3D2E] hover:bg-[#124d3a] text-white font-bold rounded-lg shadow-lg transition-all border border-[#C9A227] hover:scale-105 w-full">
                                <i className="fa-solid fa-crown mr-2 text-[#C9A227]"></i> {t('layouts.view_plans')}
                            </Link>
                        </div>
                    </div>
                )}
            </div>

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
