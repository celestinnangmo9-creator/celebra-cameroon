import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import fr from '../locales/fr.json';
import en from '../locales/en.json';

const translations = {
    fr,
    en
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children, initialLocale = 'fr' }) => {
    // 1. Try to get from localStorage
    // 2. Fallback to initialLocale from Inertia props
    // 3. Fallback to 'fr'
    const [locale, setLocaleState] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedLocale = localStorage.getItem('locale');
            if (savedLocale && ['fr', 'en'].includes(savedLocale)) {
                return savedLocale;
            }
        }
        return initialLocale;
    });

    // Update locale and sync with backend
    const setLocale = (newLocale) => {
        if (['fr', 'en'].includes(newLocale)) {
            setLocaleState(newLocale);
            localStorage.setItem('locale', newLocale);
            
            // Set cookie for Laravel middleware to read
            document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
            
            // Reload the page smoothly via Inertia to refresh validation messages
            router.reload();
        }
    };

    // Helper to get nested translation keys like 'nav.home'
    const t = (key, fallback = '') => {
        const keys = key.split('.');
        let value = translations[locale];
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                return fallback || key;
            }
        }
        
        return value;
    };

    // Sync if initialLocale changes from backend (e.g., cleared cache)
    useEffect(() => {
        if (initialLocale && initialLocale !== locale) {
            const savedLocale = localStorage.getItem('locale');
            // If we have a local preference that differs from backend, push it to backend
            if (savedLocale && savedLocale !== initialLocale) {
                document.cookie = `locale=${savedLocale}; path=/; max-age=31536000; SameSite=Lax`;
                router.reload();
            } else if (!savedLocale) {
                setLocaleState(initialLocale);
            }
        }
    }, [initialLocale]);

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
