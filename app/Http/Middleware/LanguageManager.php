<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class LanguageManager
{
    /**
     * Intercepte la requête pour appliquer la langue.
     */
    public function handle(Request $request, Closure $next)
    {
        // Read locale from the cookie set by the React frontend
        if ($request->hasCookie('locale')) {
            $locale = $request->cookie('locale');
            if (in_array($locale, ['fr', 'en'])) {
                App::setLocale($locale);
            }
        } else {
            // Sinon, on s'assure d'appliquer la langue par défaut
            App::setLocale(config('app.locale'));
        }

        return $next($request);
    }
}
