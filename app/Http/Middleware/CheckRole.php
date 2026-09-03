<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();
        if (! $user) {
            abort(403, 'Unauthorized action.');
        }

        // Super Admin has universal access
        if ($user->role === 'super_admin') {
            return $next($request);
        }

        // Admin routes can be accessed by admin or super_admin
        if ($role === 'admin' && ($user->role === 'admin' || $user->role === 'super_admin')) {
            return $next($request);
        }

        // Host routes can be accessed by host or admin
        if ($role === 'host' && ($user->role === 'host' || $user->role === 'admin' || $user->role === 'super_admin')) {
            return $next($request);
        }

        if ($user->role !== $role) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
