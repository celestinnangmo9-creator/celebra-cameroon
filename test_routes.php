<?php
$routesFile = 'routes_dump.json';
$routesJson = file_get_contents($routesFile);
$routes = json_decode($routesJson, true);

$baseUrl = 'http://127.0.0.1:8001/';

echo "Testing GET routes without parameters:\n";
echo str_pad("Route", 40) . " | " . str_pad("Status", 6) . " | " . "Notes\n";
echo str_repeat("-", 60) . "\n";

foreach ($routes as $route) {
    if (in_array('GET', $route['method'])) {
        $uri = $route['uri'];
        
        // Skip routes with parameters for this automated test, except if we can safely test them
        if (strpos($uri, '{') !== false) {
            echo str_pad($uri, 40) . " | " . str_pad("SKIPPED", 6) . " | " . "Has parameters\n";
            continue;
        }

        // Skip api routes and special routes for now
        if (str_starts_with($uri, 'api/') || str_starts_with($uri, '_ignition') || str_starts_with($uri, 'sanctum')) {
            continue;
        }

        $url = $baseUrl . ltrim($uri, '/');
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true); // Just get headers for speed
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $note = "";
        if ($httpCode == 500) {
            $note = "CRITICAL: Server Error";
        } elseif ($httpCode == 200) {
            // Let's do a full GET to check if it's empty
            $ch2 = curl_init($url);
            curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch2, CURLOPT_TIMEOUT, 5);
            $body = curl_exec($ch2);
            curl_close($ch2);
            if (empty(trim($body))) {
                $note = "WARNING: Empty Response (Possible Silent Error)";
            } else {
                $note = "OK";
            }
        } elseif ($httpCode == 302 || $httpCode == 301) {
            $note = "Redirect";
        }

        echo str_pad($uri, 40) . " | " . str_pad($httpCode, 6) . " | " . $note . "\n";
    }
}
