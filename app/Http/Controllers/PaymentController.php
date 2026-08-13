<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Services\PaymentGatewayService;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentGatewayService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Show payment page.
     */
    public function show($id)
    {
        $booking = Booking::with('venue')->findOrFail($id);

        if ($booking->user_id !== Auth::id()) {
            return redirect()->route('bookings.index')->with('error', 'Action non autorisée.');
        }

        if ($booking->payment_status === 'paid') {
            return redirect()->route('bookings.index')->with('success', 'Cette réservation est déjà payée.');
        }

        return Inertia::render('Bookings/Payment', [
            'booking' => $booking,
        ]);
    }

    /**
     * Initiate payment (Orange Money / MTN MoMo).
     */
    public function initiate(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        if ($booking->user_id !== Auth::id()) {
            return back()->with('error', 'Action non autorisée.');
        }

        $request->validate([
            'payment_method' => 'required|in:orange_money,mtn_momo',
            'phone_number' => 'required|string',
        ]);

        $response = $this->paymentService->initiatePayment($booking, $request->payment_method, $request->phone_number);

        if ($response['status'] === 'success') {
            if (isset($response['mock_redirect_url'])) {
                // SANDBOX MODE: Redirect to mock confirmation page
                return redirect($response['mock_redirect_url']);
            }
            return redirect()->route('bookings.index')->with('success', $response['message']);
        }

        return back()->with('error', $response['message']);
    }

    /**
     * SANDBOX MOCK: Simulate Webhook call from gateway
     */
    public function mockConfirmation(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        $txn = $request->query('txn');

        return Inertia::render('Bookings/MockPayment', [
            'booking' => $booking,
            'transaction_id' => $txn
        ]);
    }

    /**
     * SANDBOX MOCK: Process the mocked user action
     */
    public function processMock(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:successful,failed',
            'transaction_id' => 'required|string'
        ]);

        $this->paymentService->handleWebhook([
            'transaction_id' => $request->transaction_id,
            'status' => $request->status,
        ]);

        $msg = $request->status === 'successful' ? 'Paiement simulé avec succès !' : 'Paiement simulé échoué.';
        return redirect()->route('bookings.index')->with('success', $msg);
    }

    /**
     * Real Webhook endpoint for actual payment gateway callbacks
     */
    public function webhook(Request $request)
    {
        $payload = $request->all();
        $this->paymentService->handleWebhook($payload);
        return response()->json(['status' => 'ok']);
    }
}
