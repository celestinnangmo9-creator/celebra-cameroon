<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class DiagnoseRoutes extends Command
{
    protected $signature = 'diagnose:routes';

    protected $description = 'Teste toutes les routes GET sans paramètres pour détecter des erreurs HTTP ou des pages blanches.';

    public function handle()
    {
        $routes = \Illuminate\Support\Facades\Route::getRoutes();
        $baseUrl = url('/');
        
        $this->info("Recherche d'un utilisateur admin pour la simulation...");
        $admin = \App\Models\User::where('role', 'admin')->first();
        if ($admin) {
            \Illuminate\Support\Facades\Auth::login($admin);
            $this->info("Utilisateur admin connecté : {$admin->email}");
        } else {
            $this->warn("Aucun administrateur trouvé. Le test se fera en tant qu'invité.");
        }

        $this->info("Démarrage du diagnostic des routes internes...");
        $table = [];
        
        foreach ($routes as $route) {
            if (in_array('GET', $route->methods())) {
                $uri = $route->uri();
                
                // Ignorer les routes avec paramètres obligatoires
                if (strpos($uri, '{') !== false) {
                    continue;
                }
                
                // Ignorer API/Sanctum
                if (str_starts_with($uri, 'api') || str_starts_with($uri, 'sanctum') || str_starts_with($uri, '_ignition') || str_starts_with($uri, 'auth/google')) {
                    continue;
                }
                
                $url = $baseUrl . '/' . ltrim($uri, '/');
                
                try {
                    // Création d'une requête interne pour ne pas bloquer le serveur
                    $request = \Illuminate\Http\Request::create($url, 'GET');
                    $request->headers->set('Accept', 'text/html, application/xhtml+xml');

                    
                    $response = app()->handle($request);
                    $status = $response->getStatusCode();
                    $body = $response->getContent();
                    
                    $note = "OK";
                    if ($status >= 500) {
                        $note = "<error>ERREUR SERVEUR</error>";
                    } elseif ($status == 200 && empty(trim($body))) {
                        $note = "<error>PAGE BLANCHE (Vide)</error>";
                    } elseif ($status == 301 || $status == 302) {
                        $note = "Redirection -> " . $response->headers->get('Location');
                    }
                    
                    $table[] = [
                        'URI' => $uri,
                        'URL' => $url,
                        'Statut' => $status,
                        'Note' => $note
                    ];
                } catch (\Exception $e) {
                    $table[] = [
                        'URI' => $uri,
                        'URL' => $url,
                        'Statut' => 'EXC',
                        'Note' => substr($e->getMessage(), 0, 50)
                    ];
                }
            }
        }
        
        $this->table(['URI', 'URL', 'Statut', 'Observation'], $table);
    }
}
