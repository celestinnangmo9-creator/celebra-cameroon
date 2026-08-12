import { Link, usePage } from '@inertiajs/react';
import MobileBottomNav from '@/Components/MobileBottomNav';
import { useState, useEffect } from 'react';

export default function PublicLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('#desktop-user-btn') && !e.target.closest('#desktop-user-menu')) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header & Navigation */}
            <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
                <div className={`nav-container ${mobileMenuOpen ? 'mobile-menu-active' : ''}`}>
                    <Link href={route('home')} className="logo" style={{ padding: '0.25rem 0' }}>
                        <img src="/images/logo.png" alt="Celebra Cameroon" className="logo-img" />
                    </Link>

                    <button 
                        id="mobile-menu-btn" 
                        className="btn btn-ghost" 
                        style={{ display: 'none', fontSize: '1.5rem' }}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>

                    <ul className="nav-links" id="nav-links">
                        <li><Link href={route('home')} className={`nav-link ${route().current('home') ? 'active' : ''}`}>Accueil</Link></li>
                        <li><Link href={route('venues.index')} className={`nav-link ${route().current('venues.*') && !route().current('venues.create') ? 'active' : ''}`}>Lieux & Salles</Link></li>
                        <li><Link href={route('about')} className={`nav-link ${route().current('about') ? 'active' : ''}`}>À Propos</Link></li>
                    </ul>

                    <div className="nav-actions">
                        {(!user || user.role === 'host') && (
                            <Link href={route('venues.create')} className="nav-link font-semibold">
                                Mettre mon espace en ligne
                            </Link>
                        )}
                        
                        <button 
                            className="btn btn-ghost" 
                            title="Basculer le mode sombre/clair" 
                            style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}
                            onClick={() => document.body.classList.toggle('dark-mode')}
                        >
                            <i className="fa-solid fa-moon"></i>
                        </button>

                        <div className="user-menu-dropdown relative">
                            <button 
                                className="user-menu-btn" 
                                id="desktop-user-btn"
                                onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                            >
                                <i className="fa-solid fa-bars ml-1 text-lg"></i>
                                <div className="user-menu-avatar">
                                    {user ? (
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=059669&color=fff`} alt="" className="rounded-full w-full h-full" />
                                    ) : (
                                        <i className="fa-solid fa-user"></i>
                                    )}
                                </div>
                            </button>
                            <div className={`user-menu-content ${userMenuOpen ? 'show' : ''}`} id="desktop-user-menu">
                                {user ? (
                                    <>
                                        <Link href={route('dashboard')} className="font-semibold">Tableau de bord</Link>
                                        <Link href={route('messages.index')}>Messagerie</Link>
                                        <Link href={route('bookings.index')}>Mes réservations</Link>
                                        <div className="user-menu-divider"></div>
                                        {user.role === 'host' && (
                                            <>
                                                <Link href={route('venues.create')}>Publier un lieu</Link>
                                                <div className="user-menu-divider"></div>
                                            </>
                                        )}
                                        <Link href={route('logout')} method="post" as="button" className="w-full text-left">
                                            Déconnexion
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="font-semibold">Connexion</Link>
                                        <Link href={route('register')}>Inscription</Link>
                                        <div className="user-menu-divider"></div>
                                        <Link href={route('venues.create')}>Mettre mon espace en ligne</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="footer bg-gray-900 text-white mt-auto">
                <div className="footer-container max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <Link href={route('home')} className="logo inline-block mb-6">
                            <img src="/images/logo.png" alt="Celebra Cameroon" className="footer-logo-img h-10" />
                        </Link>
                        <p className="text-gray-400 text-sm">La plateforme événementielle référence au Cameroun. Réservez des salles de fête, espaces verts, terrasses VIP et salles de conférence en quelques clics.</p>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Les Villes Principales</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                            <ul className="space-y-3">
                                <li><Link href={route('venues.index', { city: 'Douala' })} className="hover:text-white transition"><i className="fa-solid fa-location-dot text-emerald-500 w-4"></i> Douala</Link></li>
                                <li><Link href={route('venues.index', { city: 'Yaoundé' })} className="hover:text-white transition"><i className="fa-solid fa-location-dot text-emerald-500 w-4"></i> Yaoundé</Link></li>
                                <li><Link href={route('venues.index', { city: 'Bafoussam' })} className="hover:text-white transition"><i className="fa-solid fa-location-dot text-emerald-500 w-4"></i> Bafoussam</Link></li>
                            </ul>
                            <ul className="space-y-3">
                                <li><Link href={route('venues.index', { city: 'Kribi' })} className="hover:text-white transition"><i className="fa-solid fa-location-dot text-emerald-500 w-4"></i> Kribi</Link></li>
                                <li><Link href={route('venues.index', { city: 'Limbe' })} className="hover:text-white transition"><i className="fa-solid fa-location-dot text-emerald-500 w-4"></i> Limbe</Link></li>
                                <li><Link href={route('venues.index', { city: 'Bamenda' })} className="hover:text-white transition"><i className="fa-solid fa-location-dot text-emerald-500 w-4"></i> Bamenda</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Service Client</h4>
                        <p className="text-sm text-gray-400 mb-3"><i className="fa-solid fa-phone text-amber-500 mr-2"></i> +237 696675924</p>
                        <p className="text-sm text-gray-400 mb-3"><i className="fa-solid fa-envelope text-amber-500 mr-2"></i> celestinnangmo9@gmail.com</p>
                        <p className="text-sm text-gray-400"><i className="fa-solid fa-building text-amber-500 mr-2"></i> Akwa, Douala - Cameroun</p>
                    </div>
                </div>

                <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Celebra Cameroon. Tous droits réservés.
                </div>
            </footer>

            <MobileBottomNav />
        </div>
    );
}
