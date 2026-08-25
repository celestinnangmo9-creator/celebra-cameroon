<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class LanguageController extends Controller
{
    /**
     * Change la langue de l'application et la sauvegarde en session.
     */
    public function switchLang($lang)
    {
        // On vérifie que la langue demandée est bien supportée
        if (in_array($lang, ['en', 'fr'])) {
            Session::put('applocale', $lang);
        }
        
        // On redirige l'utilisateur vers la page précédente
        return redirect()->back();
    }
}
