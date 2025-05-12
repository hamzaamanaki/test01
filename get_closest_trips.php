<?php
// get_closest_trips.php : retourne les 2 trajets les plus proches d'une position donnée

$host = 'localhost';
$dbname = 'ebus2_projet04_arrt10';
$username = 'ai77sr47rrry';
$password = 'a7!p2a.7ie';

header('Content-Type: application/json');

if (!isset($_GET['lat']) || !isset($_GET['lon'])) {
  echo json_encode(['error' => 'Coordonnées GPS manquantes.']);
  exit;
}

$lat = floatval($_GET['lat']);
$lon = floatval($_GET['lon']);

try {
  $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // Requête SQL avec calcul de distance (formule de Haversine)
  $stmt = $pdo->prepare(
    "SELECT *,
      (6371 * acos(
        cos(radians(:lat)) * cos(radians(departure_lat)) *
        cos(radians(departure_lon) - radians(:lon)) +
        sin(radians(:lat)) * sin(radians(departure_lat))
      )) AS distance
     FROM trips
     WHERE departure_lat IS NOT NULL AND departure_lon IS NOT NULL
     ORDER BY distance ASC
     LIMIT 2"
  );

  $stmt->execute([':lat' => $lat, ':lon' => $lon]);
  $trips = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode(['success' => true, 'trips' => $trips]);

} catch (Exception $e) {
  echo json_encode(['error' => 'Erreur serveur : ' . $e->getMessage()]);
  exit;
}
?>
