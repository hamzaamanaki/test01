<?php
// login.php
// Authentification utilisateur EasyTrip

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

header('Content-Type: application/json');

try {
  $host = 'localhost';
  $dbname = 'ebus2_projet04_arrt10';
  $username = 'ai77sr47rrry';
  $password = 'a7!p2a.7ie';

  $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $json = file_get_contents("php://input");
  $data = json_decode($json, true);

  if (empty($data['email']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Champs requis manquants.']);
    exit;
  }

  $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
  $stmt->execute([':email' => $data['email']]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($user && password_verify($data['password'], $user['password'])) {
    echo json_encode([
      'success' => true,
      'message' => 'Connexion réussie.',
      'user' => [
        'id' => $user['id'],
        'first_name' => $user['first_name'],
        'last_name' => $user['last_name'],
        'email' => $user['email']
      ]
    ]);
  } else {
    http_response_code(401);
    echo json_encode(['error' => 'Email ou mot de passe incorrect.']);
  }
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Erreur serveur.']);
}
?>