<?php
define('USER', 'ai77sr47rrry');
define('PASSWD', 'a7!p2a.7ie');
define('SERVER', 'localhost');
define('BASE', 'ebus2_projet04_arrt10');

$dsn = 'mysql:host=' . SERVER . ';dbname=' . BASE . ';charset=utf8';

try {
    $conn = new PDO($dsn, USER, PASSWD);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // Optionnel : log dans un fichier
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Connexion échouée']);
    exit;
}
?>
