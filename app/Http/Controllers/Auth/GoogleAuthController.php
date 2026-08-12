<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->setHttpClient(new \GuzzleHttp\Client(['verify' => false]))
                ->user();

            // On cherche l'utilisateur par email ou on le crée
            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'role' => 'client', // Rôle par défaut
                    'password' => null, // Pas de mot de passe pour les comptes sociaux
                ]
            );

            // Si l'utilisateur existait déjà (avec email), on met juste à jour son google_id
            if (!$user->google_id) {
                $user->update(['google_id' => $googleUser->getId()]);
            }

            Auth::login($user);

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (\Exception $e) {
            dd($e);
            // \Illuminate\Support\Facades\Log::error('Google Auth Error: ' . $e->getMessage());
            // return redirect('/login')->with('error', 'Erreur lors de la connexion avec Google. Veuillez réessayer.');
        }
    }
}
