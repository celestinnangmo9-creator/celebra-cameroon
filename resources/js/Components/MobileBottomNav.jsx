import { Link, usePage } from '@inertiajs/react';
import { useLanguage } from '../Contexts/LanguageContext';

export default function MobileBottomNav() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const { t } = useLanguage();

    return (
        <nav className="mobile-bottom-bar">
            <Link href={route('home')} className={`bottom-nav-item ${route().current('home') ? 'active' : ''}`}>
                <i className="fa-solid fa-house"></i>
                <span>{t('nav.home')}</span>
            </Link>
            <Link href={route('venues.index')} className={`bottom-nav-item ${route().current('venues.*') && !route().current('venues.create') ? 'active' : ''}`}>
                <i className="fa-solid fa-building"></i>
                <span>{t('nav.venues')}</span>
            </Link>
            
            {(user && (user.role === 'host' || user.role === 'admin')) && (
                <Link href={route('venues.create')} className={`bottom-nav-item ${route().current('venues.create') ? 'active' : ''}`}>
                    <i className="fa-solid fa-circle-plus"></i>
                    <span>{t('nav.publish')}</span>
                </Link>
            )}

            <Link href={route('messages.index')} className={`bottom-nav-item ${route().current('messages.*') ? 'active' : ''}`}>
                <div style={{ position: 'relative' }}>
                    <i className="fa-solid fa-comment-dots"></i>
                </div>
                <span>{t('nav.messages')}</span>
            </Link>
            
            <Link href={route('dashboard')} className={`bottom-nav-item ${route().current('dashboard') ? 'active' : ''}`}>
                <i className="fa-solid fa-user"></i>
                <span>{t('nav.profile')}</span>
            </Link>
        </nav>
    );
}
