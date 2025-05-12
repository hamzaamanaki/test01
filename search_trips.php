<?php
// search_trips.php : renvoie les 2 trajets les plus proches d'une adresse donnée

header('Content-Type: application/json');

if (!isset($_GET['address']) || empty($_GET['address'])) {
    echo json_encode(["success" => false, "error" => "Adresse manquante."]);
    exit;
}

$address = urlencode($_GET['address']);
$nominatimUrl = "https://nominatim.openstreetmap.org/search?q=$address&format=json&limit=1";

// En-tête requis par Nominatim
$options = [
    "http" => [
        "header" => "User-Agent: EasyTripApp/1.0 (hamza.amanaki@student.hepl.be)"
    ]
];
$context = stream_context_create($options);
$response = file_get_contents($nominatimUrl, false, $context);
$data = json_decode($response, true);

// Vérifie que l'adresse a bien été géocodée
if (empty($data[0]['lat']) || empty($data[0]['lon'])) {
    echo json_encode(["success" => false, "error" => "Adresse introuvable."]);
    exit;
}

$userLat = $data[0]['lat'];
$userLon = $data[0]['lon'];

try {
    $pdo = new PDO("mysql:host=localhost;dbname=ebus2_projet04_arrt10;charset=utf8", "ai77sr47rrry", "a7!p2a.7ie");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Haversine pour trouver les trajets proches
    $query = "
        SELECT *, 
        (
            6371 * acos(
                cos(radians(:lat)) *
                cos(radians(departure_lat)) *
                cos(radians(departure_lon) - radians(:lon)) +
                sin(radians(:lat)) *
                sin(radians(departure_lat))
            )
        ) AS distance
        FROM trips
        WHERE departure_lat IS NOT NULL AND departure_lon IS NOT NULL
        ORDER BY distance ASC
        LIMIT 2
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':lat' => $userLat,
        ':lon' => $userLon
    ]);

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "trips" => $results]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Erreur BDD : " . $e->getMessage()]);
}
