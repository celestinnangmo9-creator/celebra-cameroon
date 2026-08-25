<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSubscriptionPlanController extends Controller
{
    public function index()
    {
        $plans = SubscriptionPlan::all();
        return Inertia::render('Admin/Subscriptions', [
            'plans' => $plans
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'price' => 'required|numeric|min:0',
            'max_venues' => 'nullable|integer|min:1'
        ]);

        $plan = SubscriptionPlan::findOrFail($id);
        $plan->price = $request->price;
        
        if ($request->has('max_venues')) {
            $plan->max_venues = $request->max_venues;
        }

        $plan->save();

        return redirect()->back()->with('success', __('La formule :plan a été mise à jour avec succès.', ['plan' => $plan->name]));
    }
}
