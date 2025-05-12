<?php
// geocode_trips.php : ajoute latitude/longitude aux trajets en base

$host = 'localhost';
$dbname = 'ebus2_projet04_arrt10';
$username = 'ai77sr47rrry';
$password = 'a7!p2a.7ie';

try {
  $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // Récupérer les trajets sans latitude/longitude
  $stmt = $pdo->query("SELECT id, departure_address FROM trips WHERE departure_lat IS NULL OR departure_lon IS NULL");
  $trips = $stmt->fetchAll(PDO::FETCH_ASSOC);

  foreach ($trips as $trip) {
    $address = urlencode($trip['departure_address']);
    $url = "https://nominatim.openstreetmap.org/search?q={$address}&format=json&limit=1";

    // En-tête obligatoire pour l'API Nominatim
    $opts = [
      "http" => [
        "header" => "User-Agent: EasyTripApp/1.0 (hamza.amanaki@student.hepl.be)"
      ]
    ];
    $context = stream_context_create($opts);
    $response = file_get_contents($url, false, $context);
    
    $data = json_decode($response, true);

    if (!empty($data[0])) {
      $lat = $data[0]['lat'];
      $lon = $data[0]['lon'];

      // Mise à jour de la ligne
      $update = $pdo->prepare("UPDATE trips SET departure_lat = :lat, departure_lon = :lon WHERE id = :id");
      $update->execute([
        ':lat' => $lat,
        ':lon' => $lon,
        ':id' => $trip['id']
      ]);

      echo "Trip #{$trip['id']} mis à jour avec lat={$lat}, lon={$lon}\n";
    } else {
      echo "Adresse non trouvée pour le trajet #{$trip['id']} ({$trip['departure_address']})\n";
    }

    // Pause recommandée pour éviter le blocage par Nominatim
    sleep(1);
  }

  echo "\nMise à jour terminée.";

} catch (Exception $e) {
  echo "Erreur : " . $e->getMessage();
}
?>