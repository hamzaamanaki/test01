<?php
header('Content-Type: application/json');

$q = $_GET['q'] ?? '';
$limit = $_GET['limit'] ?? 5;

if (!$q) {
  http_response_code(400);
  echo json_encode(['error' => 'Paramètre "q" manquant']);
  exit;
}

$url = "https://nominatim.openstreetmap.org/search?q={$query}&format=json&limit=5&countrycodes=be";

$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'User-Agent: EasyTripApp/1.0'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);

// 🛑 Si le SSL échoue, décommente cette ligne temporairement :
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

if ($response === false || $httpCode !== 200) {
  http_response_code(500);
  echo json_encode([
    'error' => "Erreur cURL : $error",
    'httpCode' => $httpCode,
    'url' => $url
  ]);
  exit;
}

echo $response;


