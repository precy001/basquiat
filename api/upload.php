<?php
$method = $method ?? $_SERVER['REQUEST_METHOD'];

// POST /api/upload — upload product images (admin only)

if ($method !== 'POST') {
    respond(['error' => 'Method not allowed'], 405);
}

requireAuth();

$uploadDir = __DIR__ . '/../../public/assets/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if (empty($_FILES['images'])) {
    respond(['error' => 'No files uploaded'], 400);
}

$files = $_FILES['images'];
$uploaded = [];
$allowed = ['image/jpeg', 'image/png', 'image/webp'];
$maxSize = 5 * 1024 * 1024; // 5MB

// Handle both single and multiple uploads
$fileCount = is_array($files['name']) ? count($files['name']) : 1;

for ($i = 0; $i < $fileCount; $i++) {
    $name = is_array($files['name']) ? $files['name'][$i] : $files['name'];
    $tmpName = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
    $size = is_array($files['size']) ? $files['size'][$i] : $files['size'];
    $type = is_array($files['type']) ? $files['type'][$i] : $files['type'];
    $error = is_array($files['error']) ? $files['error'][$i] : $files['error'];

    if ($error !== UPLOAD_ERR_OK) {
        continue;
    }

    if (!in_array($type, $allowed)) {
        continue;
    }

    if ($size > $maxSize) {
        continue;
    }

    // Generate unique filename
    $ext = pathinfo($name, PATHINFO_EXTENSION);
    $newName = 'bag_' . time() . '_' . uniqid() . '.' . $ext;
    $destination = $uploadDir . $newName;

    if (move_uploaded_file($tmpName, $destination)) {
        $uploaded[] = '/assets/' . $newName;
    }
}

if (empty($uploaded)) {
    respond(['error' => 'No valid files were uploaded'], 400);
}

respond([
    'message' => count($uploaded) . ' file(s) uploaded',
    'paths' => $uploaded,
]);