<?php
header('Content-Type: application/json');
require_once __DIR__ . '/config/db_connect.php';

try {
  $data = json_decode(file_get_contents("php://input"), true);
  $trip_id = (int) $data['trip_id'];
  $user_id = (int) $data['user_id'];
  $seats   = (int) $data['seats_booked'];

  // Vérifie si déjà réservé
  $check = $conn->prepare("SELECT 1 FROM bookings WHERE trip_id = ? AND user_id = ?");
  $check->execute([$trip_id, $user_id]);

  if ($check->fetch()) {
    echo json_encode(['success' => false, 'error' => 'Vous avez déjà réservé ce trajet.']);
    exit;
  }

  // Si pas réservé → on insère
  $insert = $conn->prepare("INSERT INTO booking (trip_id, user_id, seats_booked, booking_date, status) 
                            VALUES (?, ?, ?, NOW(), 'confirmed')");
  $insert->execute([$trip_id, $user_id, $seats]);

  echo json_encode(['success' => true]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'Erreur serveur : ' . $e->getMessage()]);
}
?>

