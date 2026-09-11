<?php
$method = $method ?? $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    respond(['error' => 'Method not allowed'], 405);
}

if (empty($_FILES['receipt'])) {
    respond(['error' => 'No receipt uploaded'], 400);
}

$file = $_FILES['receipt'];
if ($file['error'] !== UPLOAD_ERR_OK) respond(['error' => 'Receipt upload failed'], 400);
if ($file['size'] > 8 * 1024 * 1024) respond(['error' => 'Receipt must be 8MB or smaller'], 400);

$allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
$finfo = new finfo(FILEINFO_MIME_TYPE);
$type = $finfo->file($file['tmp_name']);
if (!in_array($type, $allowed, true)) respond(['error' => 'Receipt must be JPG, PNG, WEBP or PDF'], 400);

$uploadDir = __DIR__ . '/../public/assets/receipts/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

$ext = match ($type) {
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'application/pdf' => 'pdf',
    default => 'bin'
};

$name = 'receipt_' . date('Ymd_His') . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
if (!move_uploaded_file($file['tmp_name'], $uploadDir . $name)) {
    respond(['error' => 'Could not save receipt'], 500);
}

respond(['message' => 'Receipt uploaded', 'path' => '/assets/receipts/' . $name], 201);
