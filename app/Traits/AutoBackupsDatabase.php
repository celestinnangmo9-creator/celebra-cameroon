<?php

namespace App\Traits;

use Illuminate\Support\Facades\Artisan;

trait AutoBackupsDatabase
{
    protected static function bootAutoBackupsDatabase()
    {
        static::saved(function ($model) {
            self::triggerBackup();
        });

        static::deleted(function ($model) {
            self::triggerBackup();
        });
    }

    protected static function triggerBackup()
    {
        try {
            // Run the backup command silently
            Artisan::call('app:backup-db');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Erreur lors de la sauvegarde automatique (Trait): ' . $e->getMessage());
        }
    }
}
