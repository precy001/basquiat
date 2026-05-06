<?php
// POST /api/setup — one-time setup to create admin and seed products
// DELETE this file after initial setup!

if ($method !== 'POST') {
    respond(['error' => 'Method not allowed'], 405);
}

$body = getBody();
$db = getDB();

// Check if admin already exists
$stmt = $db->query("SELECT COUNT(*) as count FROM admins");
$adminCount = (int) $stmt->fetch()['count'];

if ($adminCount > 0) {
    respond(['error' => 'Setup already completed. Delete this file.'], 403);
}

$username = $body['username'] ?? 'admin';
$password = $body['password'] ?? 'admin123';

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $db->prepare("INSERT INTO admins (username, password) VALUES (?, ?)");
$stmt->execute([$username, $hashedPassword]);

respond([
    'message' => 'Admin created successfully',
    'username' => $username,
    'warning' => 'Delete api/setup.php now!',
]);
