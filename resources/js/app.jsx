import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import React from 'react';

import ErrorBoundary from './Components/ErrorBoundary';

// Globally initialize AOS animations on page navigation
router.on('navigate', () => {
    if (window.AOS) {
        window.AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            easing: 'ease-out-cubic'
        });
        window.AOS.refresh();
    }
});

import { LanguageProvider } from './Contexts/LanguageContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ErrorBoundary>
                <LanguageProvider initialLocale={props.initialPage.props.locale}>
                    <App {...props} />
                </LanguageProvider>
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
