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
        return Socialite::driver('google')
            ->setHttpClient(new \GuzzleHttp\Client(['verify' => false]))
            ->stateless()
            ->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')
                ->setHttpClient(new \GuzzleHttp\Client(['verify' => false]))
                ->stateless()
                ->user();

            $adminEmailsString = env('ADMIN_EMAILS', 'celestinnangmo9@gmail.com,celestinnangmo@icloud.com');
            $adminEmails = array_map('trim', explode(',', $adminEmailsString));
            $role = in_array($googleUser->getEmail(), $adminEmails) ? 'admin' : 'client';

            // On cherche l'utilisateur par email ou on le crée
            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'role' => $role, // Rôle dynamique (admin ou client)
                    'password' => null, // Pas de mot de passe pour les comptes sociaux
                ]
            );

            // Si l'utilisateur existait déjà (avec email), on met juste à jour son google_id
            if (!$user->google_id) {
                $user->update(['google_id' => $googleUser->getId()]);
            }

            // Forcer le rôle admin si l'email correspond, au cas où il a été créé comme client auparavant
            if ($user->role !== 'admin' && in_array($user->email, $adminEmails)) {
                $user->update(['role' => 'admin']);
            }

            Auth::login($user);

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Google Auth Error: ' . $e->getMessage());
            return redirect('/login')->with('error', 'La connexion avec Google a échoué. Veuillez réessayer.');
        }
    }
}
