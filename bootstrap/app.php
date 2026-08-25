<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\LanguageManager::class,
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);

        $middleware->redirectGuestsTo(function (Request $request) {
            if (! $request->expectsJson()) {
                session()->flash('message', 'Veuillez vous connecter ou créer un compte pour continuer.');
                return route('login');
            }
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->respond(function (\Symfony\Component\HttpFoundation\Response $response, \Throwable $exception, Request $request) {
            if (! app()->environment(['local', 'testing']) && in_array($response->getStatusCode(), [500, 503, 404, 403])) {
                if ($request->header('X-Inertia')) {
                    return inertia('Error', ['status' => $response->getStatusCode()])
                        ->toResponse($request)
                        ->setStatusCode($response->getStatusCode());
                }
            } elseif ($response->getStatusCode() === 419) {
                return back()->with([
                    'error' => 'La session a expiré, veuillez réessayer.',
                ]);
            }

            return $response;
        });
    })->create();
