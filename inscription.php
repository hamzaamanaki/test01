<?php
// inscription.php
// Traitement du formulaire d'inscription EasyTrip (version propre)

// Affichage des erreurs désactivé en production
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

try {
  // Connexion à la base de données
  $host = 'localhost';
  $dbname = 'ebus2_projet04_arrt10';
  $username = 'ai77sr47rrry';
  $password = 'a7!p2a.7ie';

  $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // Lecture du JSON envoyé par le client
  $json_brut = file_get_contents("php://input");
  $donnees = json_decode($json_brut, true);

  if (!$donnees || empty($donnees['email']) || empty($donnees['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Données incomplètes.']);
    exit;
  }

  // Validation format de date (YYYY-MM-DD)
  $birth = $donnees['birth_date'];
  if (empty($birth) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $birth)) {
    http_response_code(400);
    echo json_encode(['error' => 'Date de naissance invalide.']);
    exit;
  }

  // Hachage du mot de passe
  $hashedPassword = password_hash($donnees['password'], PASSWORD_DEFAULT);

  // Requête préparée pour insérer l'utilisateur
  $sql = "INSERT INTO users (first_name, last_name, email, password, phone, gender, birth_date, created_at)
          VALUES (:first_name, :last_name, :email, :password, :phone, :gender, :birth_date, NOW())";

  $stmt = $pdo->prepare($sql);
  $stmt->execute([
    ':first_name' => $donnees['first_name'],
    ':last_name' => $donnees['last_name'],
    ':email' => $donnees['email'],
    ':password' => $hashedPassword,
    ':phone' => $donnees['phone'],
    ':gender' => $donnees['gender'],
    ':birth_date' => $donnees['birth_date']
  ]);
  $user_id = $pdo->lastInsertId();
  // Succès
  echo json_encode([
    'success' => true,
    'message' => 'Inscription réussie.',
    'user' => [
      'id' => $user_id,
      'first_name' => $donnees['first_name'],
      'last_name' => $donnees['last_name'],
      'email' => $donnees['email']
    ]
  ]);

} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Erreur serveur.']);
}
?>
