<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        
        <!-- FontAwesome & AOS -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
        
        <!-- Custom Design System CSS -->
        <link rel="stylesheet" href="{{ asset('css/app.css') }}?v={{ time() }}">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

        <style>
            /* Premium Page Loader */
            #page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: var(--bg-main, #f8fafc);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.8s;
            backdrop-filter: blur(10px);
            }
            
            #page-loader.loaded {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            }

            .loader-content {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            }

            .loader-logo {
            width: 90px;
            height: auto;
            z-index: 2;
            animation: pulse-logo 2s infinite ease-in-out alternate;
            }

            .loader-spinner {
            position: absolute;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 3px solid transparent;
            border-top-color: var(--primary, #059669);
            border-right-color: var(--accent, #d97706);
            animation: spin 1.5s linear infinite;
            z-index: 1;
            box-shadow: 0 0 20px rgba(5, 150, 105, 0.2);
            }
            
            .loader-spinner::before {
            content: '';
            position: absolute;
            top: 10px; left: 10px; right: 10px; bottom: 10px;
            border-radius: 50%;
            border: 3px solid transparent;
            border-top-color: var(--accent, #d97706);
            border-left-color: var(--primary, #059669);
            animation: spin-reverse 2s linear infinite;
            }

            @keyframes pulse-logo {
            0% { transform: scale(0.9); opacity: 0.8; filter: drop-shadow(0 0 10px rgba(5, 150, 105, 0.3)); }
            100% { transform: scale(1.1); opacity: 1; filter: drop-shadow(0 0 25px rgba(5, 150, 105, 0.6)); }
            }

            @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
            }
            
            @keyframes spin-reverse {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
            }
        </style>
    </head>
    <body class="font-sans antialiased">
        <!-- Page Loader -->
        <div id="page-loader">
            <div class="loader-content">
            <img src="{{ asset('images/logo.png') }}" alt="Celebra Cameroon Loader" class="loader-logo">
            <div class="loader-spinner"></div>
            </div>
        </div>

        @inertia

        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
        <script>
            // Initialize AOS Animation
            window.addEventListener('load', () => {
                AOS.init({
                    duration: 800,
                    once: true,
                    offset: 50,
                    easing: 'ease-out-cubic'
                });
            });

            // Page Loader Logic
            window.addEventListener('load', () => {
                const loader = document.getElementById('page-loader');
                if (loader) {
                    setTimeout(() => {
                        loader.classList.add('loaded');
                        setTimeout(() => {
                            if (loader.parentNode) {
                                loader.parentNode.removeChild(loader);
                            }
                        }, 800);
                    }, 500);
                }
            });
        </script>
    </body>
</html>
