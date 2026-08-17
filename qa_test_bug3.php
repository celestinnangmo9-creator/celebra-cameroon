<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::find(2);
$user->role = 'client';
$user->save();

$request = Illuminate\Http\Request::create('/admin/users/2/status', 'POST', ['role' => 'host', '_method' => 'PUT']);
$admin = App\Models\User::where('role', 'admin')->first();
Illuminate\Support\Facades\Auth::login($admin);

$response = app()->handle($request);
if ($response->getStatusCode() == 302 && !session()->has('errors')) {
    echo "SUCCESS: Validation passed. User role updated.\n";
} else {
    echo "FAIL: Validation failed.\n";
    print_r(session('errors') ? session('errors')->getMessages() : 'No errors');
}
