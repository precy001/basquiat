<?php
// POST /api/auth — Admin login

if ($method !== 'POST') {
    respond(['error' => 'Method not allowed'], 405);
}

$body = getBody();
$username = $body['username'] ?? '';
$password = $body['password'] ?? '';

if (!$username || !$password) {
    respond(['error' => 'Username and password are required'], 400);
}

$db = getDB();
$stmt = $db->prepare("SELECT * FROM admins WHERE username = ?");
$stmt->execute([$username]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin['password'])) {
    respond(['error' => 'Invalid credentials'], 401);
}

$token = jwtEncode([
    'id' => $admin['id'],
    'username' => $admin['username'],
]);

respond([
    'token' => $token,
    'user' => [
        'id' => $admin['id'],
        'username' => $admin['username'],
    ],
]);
