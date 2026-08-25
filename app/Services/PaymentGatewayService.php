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
    public function initiatePayment(Booking $booking, string $method, string $phoneNumber, float $amountToPay = null)
    {
        $amountToPay = $amountToPay ?? $booking->total_price;
        $transactionId = 'TXN-' . strtoupper(Str::random(10));
        
        $booking->update([
            'payment_method' => $method,
            'transaction_id' => $transactionId,
            'payment_status' => 'pending',
        ]);

        if (app()->environment('local')) {
            // SANDBOX MODE: Simulate a successful response from a payment gateway.
            Log::info("Sandbox Payment Initiated: {$transactionId} via {$method} for {$amountToPay} FCFA");
            
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
            'amount' => $amountToPay,
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
        $amount = isset($payload['amount']) ? (float) $payload['amount'] : null;

        if (!$transactionId) return false;

        $booking = Booking::where('transaction_id', $transactionId)->first();

        if ($booking) {
            if ($status === 'successful') {
                $newAmountPaid = $booking->amount_paid + ($amount ?? ($booking->total_price / 2)); // Default to 50% for mock
                
                $booking->update([
                    'amount_paid' => $newAmountPaid,
                    'payment_status' => $newAmountPaid >= $booking->total_price ? 'paid' : 'partially_paid',
                    'status' => 'confirmed' 
                ]);
                
                // Marquer les dates comme indisponibles maintenant que c'est confirmé
                $availabilityService = app(\App\Services\VenueAvailabilityService::class);
                $availabilityService->markDatesAsUnavailable(
                    $booking->venue,
                    $booking->id,
                    $booking->start_date,
                    $booking->end_date
                );

                Log::info("Payment successful for booking {$booking->id}. Amount Paid: {$newAmountPaid}");
            } else {
                $booking->update(['payment_status' => 'failed']);
                Log::info("Payment failed for booking {$booking->id}");
            }
            return true;
        }

        return false;
    }
}
