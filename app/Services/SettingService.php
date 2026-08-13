<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingService
{
    /**
     * Get all settings as a key-value array.
     */
    public function all(): array
    {
        return Cache::rememberForever('app_settings', function () {
            return Setting::pluck('value', 'key')->toArray();
        });
    }

    /**
     * Get a specific setting by key.
     */
    public function get(string $key, $default = null)
    {
        $settings = $this->all();
        return $settings[$key] ?? $default;
    }

    /**
     * Update settings.
     */
    public function update(array $settings): void
    {
        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
        
        Cache::forget('app_settings');
    }
    
    /**
     * Get default settings for initialization.
     */
    public function getDefaults(): array
    {
        return [
            'commission_percentage' => '10',
            'maintenance_mode' => '0',
            'payment_orange_money_active' => '1',
            'payment_mtn_momo_active' => '1',
        ];
    }
}
