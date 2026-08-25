<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!$user->isHost()) {
            return redirect()->route('dashboard');
        }

        $plans = SubscriptionPlan::all();

        return Inertia::render('Dashboard/Subscription', [
            'plans' => $plans,
            'userSubscription' => [
                'status' => $user->subscription_status,
                'plan' => $user->subscription_plan,
                'trial_ends_at' => $user->trial_ends_at,
                'subscription_ends_at' => $user->subscription_ends_at,
            ]
        ]);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_slug' => 'required|exists:subscription_plans,slug'
        ]);

        $user = Auth::user();
        $plan = SubscriptionPlan::where('slug', $request->plan_slug)->first();

        // Simuler un paiement réussi (l'intégration OM/MTN se fera plus tard)
        $user->subscription_plan = $plan->slug;
        $user->subscription_status = 'active';
        $user->subscription_ends_at = Carbon::now()->addDays(30);
        $user->save();

        // Réactiver les salles masquées
        Venue::where('user_id', $user->id)->where('status', 'hidden')->update(['status' => 'active']);

        // Si le plan est Premium, mettre en avant toutes les salles
        if ($plan->slug === 'premium') {
            Venue::where('user_id', $user->id)->update(['is_featured' => true]);
        } else {
            Venue::where('user_id', $user->id)->update(['is_featured' => false]);
            // Optionnel : Gérer la limite de salles actives si basique (max_venues)
        }

        return redirect()->back()->with('success', __('Votre abonnement :plan a été activé avec succès !', ['plan' => $plan->name]));
    }
}
