import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../Contexts/LanguageContext';

export default function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (newLocale) => {
        setLocale(newLocale);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                title="Changer de langue / Change language"
            >
                <img 
                    src={locale === 'fr' ? 'https://flagcdn.com/w20/fr.png' : 'https://flagcdn.com/w20/gb.png'} 
                    alt={locale === 'fr' ? 'Français' : 'English'} 
                    className="w-5 h-auto rounded-sm"
                />
                <span className="uppercase text-gray-700 dark:text-gray-300 hidden md:inline-block">{locale}</span>
                <i className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 transform origin-top-right transition-all">
                    <button
                        onClick={() => handleSelect('fr')}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${locale === 'fr' ? 'text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-900/20' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                        <img src="https://flagcdn.com/w20/fr.png" alt="Français" className="w-5 h-auto rounded-sm" />
                        Français
                    </button>
                    <button
                        onClick={() => handleSelect('en')}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${locale === 'en' ? 'text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-900/20' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                        <img src="https://flagcdn.com/w20/gb.png" alt="English" className="w-5 h-auto rounded-sm" />
                        English
                    </button>
                </div>
            )}
        </div>
    );
}
