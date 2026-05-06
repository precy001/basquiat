<?php
$method = $method ?? $_SERVER['REQUEST_METHOD'];
$id = $id ?? null;
$db = getDB();

switch ($method) {

    // GET /api/products — list all (public)
    // GET /api/products/{id} — get single (public)
    case 'GET':
        if ($id) {
            $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
            $stmt->execute([$id]);
            $product = $stmt->fetch();
            if (!$product) respond(['error' => 'Product not found'], 404);
            $product['images'] = json_decode($product['images']);
            $product['price'] = (float) $product['price'];
            respond($product);
        } else {
            $stmt = $db->query("SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC");
            $products = $stmt->fetchAll();
            foreach ($products as &$p) {
                $p['images'] = json_decode($p['images']);
                $p['price'] = (float) $p['price'];
            }
            respond($products);
        }
        break;

    // POST /api/products — create (admin only)
    case 'POST':
        requireAuth();
        $body = getBody();

        $required = ['name', 'price', 'category', 'images'];
        foreach ($required as $field) {
            if (empty($body[$field])) {
                respond(['error' => "$field is required"], 400);
            }
        }

        $stmt = $db->prepare(
            "INSERT INTO products (name, price, category, description, images) VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $body['name'],
            $body['price'],
            $body['category'],
            $body['description'] ?? '',
            json_encode($body['images']),
        ]);

        $newId = $db->lastInsertId();
        $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$newId]);
        $product = $stmt->fetch();
        $product['images'] = json_decode($product['images']);
        $product['price'] = (float) $product['price'];

        respond($product, 201);
        break;

    // PUT /api/products/{id} — update (admin only)
    case 'PUT':
        requireAuth();
        if (!$id) respond(['error' => 'Product ID required'], 400);

        $body = getBody();
        $fields = [];
        $values = [];

        $allowed = ['name', 'price', 'category', 'description', 'images', 'is_active'];
        foreach ($allowed as $field) {
            if (isset($body[$field])) {
                $fields[] = "$field = ?";
                $values[] = $field === 'images' ? json_encode($body[$field]) : $body[$field];
            }
        }

        if (empty($fields)) respond(['error' => 'No fields to update'], 400);

        $values[] = $id;
        $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($values);

        $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        $product['images'] = json_decode($product['images']);
        $product['price'] = (float) $product['price'];

        respond($product);
        break;

    // DELETE /api/products/{id} — delete (admin only)
    case 'DELETE':
        requireAuth();
        if (!$id) respond(['error' => 'Product ID required'], 400);

        $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);

        respond(['message' => 'Product deleted']);
        break;

    default:
        respond(['error' => 'Method not allowed'], 405);
}