<?php
require_once __DIR__ . '/../config/database.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$apiPos = strpos($uri, '/api/');
if ($apiPos !== false) {
    $uri = substr($uri, $apiPos + 5);
} else {
    $uri = '';
}

$segments = explode('/', trim($uri, '/'));
$method = $_SERVER['REQUEST_METHOD'];

$resource = $segments[0] ?? '';
$id = $segments[1] ?? null;

switch ($resource) {
    case 'auth':
        require_once __DIR__ . '/auth.php';
        break;
    case 'products':
        require_once __DIR__ . '/products.php';
        break;
    case 'orders':
        require_once __DIR__ . '/orders.php';
        break;
    case 'setup':
        require_once __DIR__ . '/setup.php';
        break;
    case 'upload':
        require_once __DIR__ . '/upload.php';
        break;
    case 'seed':
        require_once __DIR__ . '/seed.php';
        break;
    default:
        respond(['error' => 'Endpoint not found'], 404);
}