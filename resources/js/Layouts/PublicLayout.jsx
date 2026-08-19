import { Link, usePage } from '@inertiajs/react';
import MobileBottomNav from '@/Components/MobileBottomNav';
import { useState, useEffect } from 'react';

export default function PublicLayout({ children }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        if (window.AOS) {
            window.AOS.init({
                duration: 800,
                once: true,
                offset: 50,
                easing: 'ease-out-cubic'
            });
            window.AOS.refresh();
        }
    }, []);

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
        <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 flex flex-col">
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
                        {!user && (
                            <>
                                <li className="md:hidden mt-4 pt-4 border-t border-gray-100/20">
                                    <Link href={route('login')} className="nav-link font-bold">Connexion</Link>
                                </li>
                                <li className="md:hidden">
                                    <Link href={route('register')} className="nav-link font-bold text-emerald-400">Créer un compte</Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <div className="nav-actions">
                        {(!user || user.role === 'host') && (
                            <Link href={route('venues.create')} className="nav-link font-semibold">
                                Mettre mon espace en ligne
                            </Link>
                        )}
                        
                        <button 
                            className="btn btn-ghost w-10 h-10 rounded-full p-0 flex items-center justify-center" 
                            title="Basculer le mode sombre/clair" 
                            onClick={() => document.body.classList.toggle('dark-mode')}
                        >
                            <i className="fa-solid fa-moon"></i>
                        </button>

                        {user ? (
                            <div className="relative">
                                <button 
                                    id="desktop-user-btn"
                                    className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-4 py-2 hover:shadow-md transition-shadow duration-200"
                                    onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                                >
                                    <i className="fa-solid fa-bars text-gray-500"></i>
                                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center overflow-hidden">
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=059669&color=fff`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                </button>
                                
                                {userMenuOpen && (
                                    <div 
                                        className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 flex flex-col transform origin-top-right transition-all"
                                        id="desktop-user-menu"
                                    >
                                        <div className="px-5 py-2 mb-2 border-b border-gray-100">
                                            <div className="font-bold text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500 truncate">{user.email}</div>
                                        </div>
                                        <Link href={route('dashboard')} className="px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors font-medium flex items-center gap-3"><i className="fa-solid fa-chart-line w-4"></i> Tableau de bord</Link>
                                        <Link href={route('messages.index')} className="px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors font-medium flex items-center gap-3"><i className="fa-solid fa-envelope w-4"></i> Messagerie</Link>
                                        <Link href={route('bookings.index')} className="px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors font-medium flex items-center gap-3"><i className="fa-solid fa-calendar-check w-4"></i> Mes réservations</Link>
                                        <div className="h-px bg-gray-100 my-2"></div>
                                        {user.role === 'host' && (
                                            <>
                                                <Link href={route('venues.create')} className="px-5 py-2.5 text-sm text-emerald-600 hover:bg-gray-50 transition-colors font-bold flex items-center gap-3"><i className="fa-solid fa-plus w-4"></i> Publier un lieu</Link>
                                                <div className="h-px bg-gray-100 my-2"></div>
                                            </>
                                        )}
                                        <Link href={route('logout')} method="post" as="button" className="px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium text-left flex items-center gap-3"><i className="fa-solid fa-arrow-right-from-bracket w-4"></i> Déconnexion</Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-3">
                                <Link href={route('login')} className="px-4 py-2 text-sm font-semibold text-[#0B3D2E] hover:text-[#C9A227] transition-colors" style={{fontFamily: 'Inter, sans-serif'}}>
                                    Se connecter
                                </Link>
                                <Link href={route('register')} className="px-5 py-2 text-sm font-bold text-[#FAF6F0] bg-[#0B3D2E] hover:bg-[#072a1f] rounded-full transition-colors shadow-md" style={{fontFamily: 'Inter, sans-serif'}}>
                                    Créer un compte
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

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

            {/* Main Content */}
            <main className="flex-1 flex flex-col pb-24 md:pb-0">
                {children}
            </main>

            {/* Footer */}
            {route().current('home') && (
                <footer className="footer bg-gray-900 text-white mt-auto pb-24 md:pb-0">
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
            )}

            <MobileBottomNav />
        </div>
    );
}
