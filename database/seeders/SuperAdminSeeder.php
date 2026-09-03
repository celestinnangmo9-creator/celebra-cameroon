<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'celestinnangmo9@gmail.com'],
            [
                'name' => 'Celestin Nangmo (Super Admin)',
                'password' => Hash::make('ange2727'),
                'role' => 'super_admin',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        echo "Super Admin setup complete: ID {$user->id}, Email: {$user->email}, Role: {$user->role}\n";
    }
}
