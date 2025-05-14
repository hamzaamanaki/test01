<?php
header('Content-Type: application/json');

// Connexion à la base de données
$host = 'localhost';
$dbname = 'ebus2_projet04_arrt10';
$username = 'ai77sr47rrry';
$password = 'a7!p2a.7ie';

// Vérifie les paramètres requis
if (!isset($_GET['lat'], $_GET['lon'], $_GET['city'])) {
  echo json_encode(['success' => false, 'error' => 'Coordonnées ou ville manquantes.']);
  exit;
}

// Récupération et nettoyage des paramètres
$lat = floatval($_GET['lat']);
$lon = floatval($_GET['lon']);
$city = trim($_GET['city']);
$maxDistance = 50; // distance max en km (modifiable si besoin)

try {
  $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $sql = "
    SELECT *, (
      6371 * ACOS(
        COS(RADIANS(:lat)) * COS(RADIANS(departure_lat)) *
        COS(RADIANS(departure_lon) - RADIANS(:lon)) +
        SIN(RADIANS(:lat)) * SIN(RADIANS(departure_lat))
      )
    ) AS distance
    FROM trips
    WHERE departure_city = :city
      AND seats_available > 0
    HAVING distance <= :maxDistance
    ORDER BY distance ASC
    LIMIT 10
  ";

  $stmt = $pdo->prepare($sql);
  $stmt->execute([
    ':lat' => $lat,
    ':lon' => $lon,
    ':city' => $city,
    ':maxDistance' => $maxDistance
  ]);

  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode(['success' => true, 'trips' => $results]);

} catch (PDOException $e) {
  echo json_encode(['success' => false, 'error' => 'Erreur serveur : ' . $e->getMessage()]);
}
