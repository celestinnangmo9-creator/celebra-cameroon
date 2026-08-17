<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class BackupDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:backup-db';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sauvegarde automatiquement la base de données';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $connection = config('database.default');
        $date = now()->format('Y-m-d_H-i-s');
        $backupDir = storage_path('app/private/backups');

        if (!\Illuminate\Support\Facades\File::exists($backupDir)) {
            \Illuminate\Support\Facades\File::makeDirectory($backupDir, 0755, true);
        }

        if ($connection === 'sqlite') {
            $dbPath = database_path('database.sqlite');
            if (file_exists($dbPath)) {
                $backupPath = $backupDir . '/database_' . $date . '.sqlite';
                copy($dbPath, $backupPath);
                $this->info("Sauvegarde SQLite réussie : {$backupPath}");
                \Illuminate\Support\Facades\Log::info("Backup SQLite effectué : {$backupPath}");
            } else {
                $this->error("Fichier SQLite introuvable !");
            }
        } elseif ($connection === 'mysql') {
            $dbName = config('database.connections.mysql.database');
            $dbUser = config('database.connections.mysql.username');
            $dbPass = config('database.connections.mysql.password');
            $host = config('database.connections.mysql.host');
            
            $backupPath = $backupDir . '/database_' . $date . '.sql';
            
            // Note: sous WAMP, mysqldump doit être dans le PATH, ou vous devrez spécifier le chemin complet
            $command = "mysqldump --user={$dbUser} --password={$dbPass} --host={$host} {$dbName} > {$backupPath}";
            
            $returnVar = NULL;
            $output  = NULL;
            exec($command, $output, $returnVar);

            if ($returnVar === 0) {
                $this->info("Sauvegarde MySQL réussie : {$backupPath}");
                \Illuminate\Support\Facades\Log::info("Backup MySQL effectué : {$backupPath}");
            } else {
                $this->error("Échec de la sauvegarde MySQL (Assurez-vous que mysqldump est accessible).");
            }
        } else {
            $this->error("Driver de base de données non supporté pour la sauvegarde automatique.");
        }

        // Optionnel : Nettoyage des vieilles sauvegardes (on garde les 50 dernières pour le temps réel)
        $files = \Illuminate\Support\Facades\File::files($backupDir);
        if (count($files) > 50) {
            usort($files, function($a, $b) {
                return filemtime($a) - filemtime($b);
            });
            $filesToDelete = array_slice($files, 0, count($files) - 50);
            foreach ($filesToDelete as $file) {
                \Illuminate\Support\Facades\File::delete($file);
            }
            $this->info(count($filesToDelete) . " ancienne(s) sauvegarde(s) supprimée(s).");
        }
    }
}
