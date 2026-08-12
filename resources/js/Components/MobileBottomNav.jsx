import { Link, usePage } from '@inertiajs/react';

export default function MobileBottomNav() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <nav className="mobile-bottom-bar">
            <Link href={route('home')} className={`bottom-nav-item ${route().current('home') ? 'active' : ''}`}>
                <i className="fa-solid fa-house"></i>
                <span>Accueil</span>
            </Link>
            <Link href={route('venues.index')} className={`bottom-nav-item ${route().current('venues.*') && !route().current('venues.create') ? 'active' : ''}`}>
                <i className="fa-solid fa-building"></i>
                <span>Salles</span>
            </Link>
            
            {(user && (user.role === 'host' || user.role === 'admin')) && (
                <Link href={route('venues.create')} className={`bottom-nav-item ${route().current('venues.create') ? 'active' : ''}`}>
                    <i className="fa-solid fa-circle-plus"></i>
                    <span>Publier</span>
                </Link>
            )}

            <Link href={route('messages.index')} className={`bottom-nav-item ${route().current('messages.*') ? 'active' : ''}`}>
                <div style={{ position: 'relative' }}>
                    <i className="fa-solid fa-comment-dots"></i>
                </div>
                <span>Messages</span>
            </Link>
            
            <Link href={route('dashboard')} className={`bottom-nav-item ${route().current('dashboard') ? 'active' : ''}`}>
                <i className="fa-solid fa-user"></i>
                <span>Profil</span>
            </Link>
        </nav>
    );
}
