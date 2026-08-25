<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LanguageController;

Route::get('lang/{lang}', [LanguageController::class, 'switchLang'])->name('lang.switch');

// Public Pages
Route::get('/', [VenueController::class, 'home'])->name('home');

Route::get('/venues', [VenueController::class, 'index'])->name('venues.index');
Route::get('/venues/{id}', [VenueController::class, 'show'])->name('venues.show')->where('id', '[0-9]+');
Route::get('/venues/{id}/availability', [BookingController::class, 'checkAvailability'])->name('venues.availability')->where('id', '[0-9]+');

// Dashboard Route
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Venues Management Routes
    Route::get('/venues/create', [VenueController::class, 'create'])->name('venues.create');
    Route::post('/venues', [VenueController::class, 'store'])->name('venues.store');
    Route::get('/venues/{id}/edit', [VenueController::class, 'edit'])->name('venues.edit');
    Route::put('/venues/{id}', [VenueController::class, 'update'])->name('venues.update');
    Route::delete('/venues/{id}', [VenueController::class, 'destroy'])->name('venues.destroy');
    
    Route::get('/venues/{id}/stats', [VenueController::class, 'stats'])->name('venues.stats');
    Route::post('/venues/{id}/block-dates', [VenueController::class, 'blockDates'])->name('venues.blockDates');
    Route::delete('/venues/{id}/block-dates/{blockedDateId}', [VenueController::class, 'unblockDate'])->name('venues.unblockDate');

    // Bookings Routes
    Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
    
    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');
    Route::post('/venues/{id}/favorite', [FavoriteController::class, 'toggle'])->name('favorites.toggle');

    // Notifications
    Route::post('/notifications/mark-read', [NotificationController::class, 'markAsRead'])->name('notifications.markRead');
    
    // Payments
    Route::get('/bookings/{id}/pay', [PaymentController::class, 'show'])->name('bookings.payment');
    Route::post('/bookings/{id}/pay', [PaymentController::class, 'initiate'])->name('bookings.payment.initiate');
    
    // Sandbox Mocks
    Route::get('/bookings/{id}/payment-mock', [PaymentController::class, 'mockConfirmation'])->name('bookings.payment.mock');
    Route::post('/bookings/{id}/payment-mock', [PaymentController::class, 'processMock'])->name('bookings.payment.processMock');
    Route::patch('/bookings/{id}/status', [BookingController::class, 'updateStatus'])->name('bookings.updateStatus');

    // Messages & Visits Routes
    Route::get('/messages/unread-counts', [MessageController::class, 'unreadCounts'])->name('messages.unreadCounts');
    Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
    
    // Reviews
    Route::post('/venues/{venue}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');
    Route::get('/messages/fetch/{contact}', [MessageController::class, 'fetch'])->name('messages.fetch');
    Route::post('/messages/mark-as-read/{contact}', [MessageController::class, 'markAsRead'])->name('messages.markAsRead');
    Route::post('/appointments', [MessageController::class, 'scheduleVisit'])->name('appointments.store');

    // Host Appointments Management
    Route::get('/host/appointments', [AppointmentController::class, 'index'])->name('host.appointments.index');
    Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateStatus'])->name('appointments.updateStatus');

    // Host Subscriptions
    Route::get('/dashboard/subscription', [SubscriptionController::class, 'index'])->name('subscriptions.index');
    Route::post('/dashboard/subscription/subscribe', [SubscriptionController::class, 'subscribe'])->name('subscriptions.subscribe');

    // Admin Routes
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\AdminController::class, 'index'])->name('dashboard');
        Route::get('/venues', [\App\Http\Controllers\AdminController::class, 'venues'])->name('venues');
        Route::get('/venues/{id}', [\App\Http\Controllers\AdminController::class, 'showVenue'])->name('venues.show');
        Route::patch('/venues/{id}/status', [\App\Http\Controllers\AdminController::class, 'updateVenueStatus'])->name('venues.updateStatus');
        Route::get('/users', [\App\Http\Controllers\AdminController::class, 'users'])->name('users');
        Route::get('/users/{id}', [\App\Http\Controllers\AdminController::class, 'showUser'])->name('users.show');
        Route::patch('/users/{id}/status', [\App\Http\Controllers\AdminController::class, 'updateUserStatus'])->name('users.updateStatus');
        Route::delete('/users/{id}', [\App\Http\Controllers\AdminController::class, 'destroyUser'])->name('users.destroy');
        Route::get('/transactions', [\App\Http\Controllers\AdminController::class, 'transactions'])->name('transactions');
        Route::get('/settings', [\App\Http\Controllers\AdminController::class, 'settings'])->name('settings');
        Route::post('/settings', [\App\Http\Controllers\AdminController::class, 'updateSettings'])->name('settings.update');
        Route::get('/subscriptions', [\App\Http\Controllers\AdminSubscriptionPlanController::class, 'index'])->name('subscriptions');
        Route::put('/subscriptions/{id}', [\App\Http\Controllers\AdminSubscriptionPlanController::class, 'update'])->name('subscriptions.update');
    });
});

// About & Contact Static Views
Route::inertia('/about', 'About')->name('about');
Route::inertia('/contact', 'Contact')->name('contact');

// Webhooks (No CSRF usually, but since it's a web route for this demo, it might need exclusions in VerifyCsrfToken)
// For a real production app, webhooks go to api.php or are excluded from CSRF.
Route::post('/webhooks/payment', [PaymentController::class, 'webhook'])->name('webhooks.payment');

require __DIR__ . '/auth.php';
