<?php

// Headers pour API REST
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

// Connexion BDD
require_once __DIR__ . '/config/db_connect.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (
        !$input ||
        empty($input['id']) ||
        empty($input['first_name']) ||
        empty($input['last_name']) ||
        empty($input['email'])
    ) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Champs requis manquants'
        ]);
        exit;
    }

    $id         = (int) $input['id'];
    $first_name = trim($input['first_name']);
    $last_name  = trim($input['last_name']);
    $email      = trim($input['email']);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Adresse email invalide'
        ]);
        exit;
    }

    // Mise à jour en base
    $stmt = $conn->prepare("
        UPDATE users 
        SET first_name = :first_name, last_name = :last_name, email = :email 
        WHERE id = :id
    ");

    $stmt->execute([
        ':first_name' => $first_name,
        ':last_name'  => $last_name,
        ':email'      => $email,
        ':id'         => $id
    ]);

    echo json_encode(['success' => true]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Erreur serveur : ' . $e->getMessage()
    ]);
}




