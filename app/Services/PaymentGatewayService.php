<?php

namespace App\Services;

use App\Models\Booking;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class PaymentGatewayService
{
    /**
     * Initiate a payment request for a booking.
     * In Sandbox mode, we simulate the aggregator.
     */
    public function initiatePayment(Booking $booking, string $method, string $phoneNumber)
    {
        $transactionId = 'TXN-' . strtoupper(Str::random(10));
        
        $booking->update([
            'payment_method' => $method,
            'transaction_id' => $transactionId,
            'payment_status' => 'pending',
        ]);

        if (app()->environment('local')) {
            // SANDBOX MODE: Simulate a successful response from a payment gateway.
            Log::info("Sandbox Payment Initiated: {$transactionId} via {$method} for {$booking->total_price} FCFA");
            
            // In a real scenario, you'd get a payment URL to redirect the user to,
            // or send a USSD push and wait for the webhook.
            // Here we return a mock success response with the transaction ID.
            return [
                'status' => 'success',
                'transaction_id' => $transactionId,
                'message' => 'Paiement initié. Veuillez confirmer sur votre téléphone.',
                'mock_redirect_url' => route('bookings.payment.mock', ['id' => $booking->id, 'txn' => $transactionId])
            ];
        }

        // REAL INTEGRATION (Campay, Monetbil, CinetPay, etc.)
        // Example with a generic HTTP call:
        /*
        $response = Http::withToken(env('PAYMENT_GATEWAY_TOKEN'))->post('https://api.payment.com/v1/collect', [
            'amount' => $booking->total_price,
            'currency' => 'XAF',
            'external_reference' => $transactionId,
            'phone_number' => $phoneNumber,
        ]);
        
        if ($response->successful()) {
            return [
                'status' => 'success',
                'transaction_id' => $transactionId,
                'message' => 'Paiement initié.',
            ];
        }
        */

        return [
            'status' => 'error',
            'message' => 'Erreur lors de l\'initiation du paiement.',
        ];
    }

    /**
     * Handle webhook from payment gateway.
     */
    public function handleWebhook(array $payload)
    {
        // Sandbox mock or real integration validation
        $transactionId = $payload['transaction_id'] ?? null;
        $status = $payload['status'] ?? null; // 'successful', 'failed'

        if (!$transactionId) return false;

        $booking = Booking::where('transaction_id', $transactionId)->first();

        if ($booking) {
            if ($status === 'successful') {
                $booking->update([
                    'payment_status' => 'paid',
                    // Optional: automatically confirm the booking if paid
                    'status' => 'confirmed' 
                ]);
                Log::info("Payment successful for booking {$booking->id}");
            } else {
                $booking->update(['payment_status' => 'failed']);
                Log::info("Payment failed for booking {$booking->id}");
            }
            return true;
        }

        return false;
    }
}
