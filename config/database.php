<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'basquiat_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// JWT secret key — change this in production!
define('JWT_SECRET', 'basquiat_secret_key_change_this_2026');

// CORS headers — allow your frontend origin
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
function getDB() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
        exit();
    }
}

// Helper: send JSON response
function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit();
}

// Helper: get JSON body from request
function getBody() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

// Helper: simple JWT encode
function jwtEncode($payload) {
    $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload['exp'] = time() + (60 * 60 * 24); // 24 hours
    $payload = base64_encode(json_encode($payload));
    $signature = base64_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$signature";
}

// Helper: simple JWT decode
function jwtDecode($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;

    [$header, $payload, $signature] = $parts;
    $validSig = base64_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));

    if ($signature !== $validSig) return null;

    $data = json_decode(base64_decode($payload), true);
    if ($data['exp'] < time()) return null;

    return $data;
}

// Helper: require admin auth
function requireAuth() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!preg_match('/Bearer\s+(.+)/', $authHeader, $matches)) {
        respond(['error' => 'Unauthorized'], 401);
    }

    $user = jwtDecode($matches[1]);
    if (!$user) {
        respond(['error' => 'Invalid or expired token'], 401);
    }

    return $user;
}
