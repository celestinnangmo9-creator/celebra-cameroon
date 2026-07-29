import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div 
            className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0 relative"
        >
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
            >
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
            </div>

            {/* Logo */}
            <div className="relative z-10 mb-8 mt-10">
                <Link href="/">
                    <div className="flex flex-col items-center">
                        <div className="bg-white/20 p-4 rounded-full backdrop-blur-md border border-white/30 shadow-[0_0_15px_rgba(5,150,105,0.5)]">
                            <ApplicationLogo className="h-16 w-16 fill-current text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mt-4 tracking-wider" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)"}}>
                            CELEBRA <span className="text-amber-500">CAMEROON</span>
                        </h1>
                        <p className="text-emerald-100 text-sm mt-1 uppercase tracking-[0.2em]">Espaces d'Exception</p>
                    </div>
                </Link>
            </div>

            {/* Glassmorphism Card */}
            <div className="relative z-10 w-full overflow-hidden px-8 py-10 sm:max-w-md sm:rounded-2xl
                            bg-white/85 backdrop-blur-xl shadow-2xl border border-white/40
                            dark:bg-slate-900/85 dark:border-slate-700/50">
                {children}
            </div>
            
            {/* Footer text */}
            <div className="relative z-10 mt-8 pb-8 text-white/60 text-sm">
                &copy; {new Date().getFullYear()} Celebra Cameroon. Tous droits réservés.
            </div>
        </div>
    );
}
