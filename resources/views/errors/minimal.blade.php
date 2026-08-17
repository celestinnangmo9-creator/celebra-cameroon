<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title') - Celebra Cameroon</title>
    <style>
        body {
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #FAF6F0; /* Ivoire */
            color: #0B3D2E; /* Vert émeraude */
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
        }
        .container {
            max-width: 600px;
            padding: 2rem;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(11, 61, 46, 0.1);
        }
        h1 {
            font-family: 'Fraunces', serif;
            font-size: 5rem;
            margin: 0;
            color: #C9A227; /* Or festif */
        }
        h2 {
            font-size: 1.5rem;
            margin-top: 0.5rem;
        }
        p {
            color: #4b5563;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        a {
            display: inline-block;
            background-color: #0B3D2E;
            color: #ffffff;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            transition: background-color 0.2s;
        }
        a:hover {
            background-color: #082d22;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>@yield('code')</h1>
        <h2>@yield('message')</h2>
        <p>@yield('description', 'Nous rencontrons un problème inattendu. Veuillez réessayer plus tard.')</p>
        <a href="{{ url('/') }}">Retour à l'accueil</a>
    </div>
</body>
</html>
