<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            return (new MailMessage)
                ->subject('Vérifiez votre adresse email - Celebra Cameroon')
                ->greeting('Bonjour ' . $notifiable->name . ' !')
                ->line('Merci de vous être inscrit sur Celebra Cameroon. Veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email.')
                ->action('Vérifier mon adresse email', $url)
                ->line('Si vous n\'avez pas créé de compte, aucune action n\'est requise de votre part.')
                ->salutation('L\'équipe Celebra Cameroon');
        });

        ResetPassword::toMailUsing(function (object $notifiable, string $token) {
            $url = url(route('password.reset', [
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false));

            return (new MailMessage)
                ->subject('Réinitialisation de mot de passe - Celebra Cameroon')
                ->greeting('Bonjour !')
                ->line('Vous recevez cet email car nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.')
                ->action('Réinitialiser le mot de passe', $url)
                ->line('Ce lien expirera dans 60 minutes.')
                ->line('Si vous n\'avez pas demandé de réinitialisation, aucune action n\'est requise.')
                ->salutation('L\'équipe Celebra Cameroon');
        });
    }
}
