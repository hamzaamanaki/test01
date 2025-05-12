<?php
if (!isset($_GET['q'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Paramètre manquant']);
  exit;
}

$query = urlencode($_GET['q']);
$url = "https://nominatim.openstreetmap.org/search?q={$query}&format=json&limit=1";

// Envoie la requête en tant que serveur
$options = [
  'http' => [
    'header' => "User-Agent: EasyTripApp/1.0\r\n"
  ]
];
$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

header('Content-Type: application/json');
echo $response;
