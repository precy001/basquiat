<?php
$method = $method ?? $_SERVER['REQUEST_METHOD'];
$id = $id ?? null;
$db = getDB();

switch ($method) {

    case 'GET':
        requireAuth();

        if ($id) {
            $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
            $stmt->execute([$id]);
            $order = $stmt->fetch();
            if (!$order) respond(['error' => 'Order not found'], 404);

            $order['total_amount'] = (float) $order['total_amount'];

            $stmt = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
            $stmt->execute([$id]);
            $items = $stmt->fetchAll();
            foreach ($items as &$item) {
                $item['product_price'] = (float) $item['product_price'];
                $item['subtotal'] = (float) $item['subtotal'];
            }
            $order['items'] = $items;

            respond($order);
        } else {
            $status = $_GET['status'] ?? null;
            $sql = "SELECT * FROM orders";
            $params = [];

            if ($status) {
                $sql .= " WHERE status = ?";
                $params[] = $status;
            }
            $sql .= " ORDER BY created_at DESC";

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $orders = $stmt->fetchAll();

            foreach ($orders as &$order) {
                $order['total_amount'] = (float) $order['total_amount'];
                $countStmt = $db->prepare("SELECT COUNT(*) as count FROM order_items WHERE order_id = ?");
                $countStmt->execute([$order['id']]);
                $order['item_count'] = (int) $countStmt->fetch()['count'];
            }

            respond($orders);
        }
        break;

    case 'POST':
        $body = getBody();

        $required = ['customer_name', 'customer_phone', 'delivery_address', 'items'];
        foreach ($required as $field) {
            if (empty($body[$field])) {
                respond(['error' => "$field is required"], 400);
            }
        }

        if (!is_array($body['items']) || count($body['items']) === 0) {
            respond(['error' => 'At least one item is required'], 400);
        }

        $totalAmount = 0;
        $orderItems = [];

        foreach ($body['items'] as $item) {
            // Accept product details directly from frontend
            $productName = $item['product_name'] ?? null;
            $productPrice = $item['product_price'] ?? null;
            $quantity = $item['quantity'] ?? 0;
            $productId = $item['product_id'] ?? 0;

            if (!$quantity || $quantity < 1) {
                respond(['error' => 'Each item needs a valid quantity'], 400);
            }

            // Try DB lookup first, fall back to provided details
            if ($productId) {
                $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
                $stmt->execute([$productId]);
                $product = $stmt->fetch();
                if ($product) {
                    $productName = $product['name'];
                    $productPrice = (float) $product['price'];
                }
            }

            // If we still don't have name/price, use what was sent
            if (!$productName || !$productPrice) {
                respond(['error' => 'Each item needs product_name and product_price'], 400);
            }

            $subtotal = $productPrice * $quantity;
            $totalAmount += $subtotal;

            $orderItems[] = [
                'product_id' => $productId ?: 0,
                'product_name' => $productName,
                'product_price' => $productPrice,
                'quantity' => $quantity,
                'subtotal' => $subtotal,
            ];
        }

        $db->beginTransaction();
        try {
            $stmt = $db->prepare(
                "INSERT INTO orders (customer_name, customer_phone, customer_email, delivery_address, order_note, total_amount)
                 VALUES (?, ?, ?, ?, ?, ?)"
            );
            $stmt->execute([
                $body['customer_name'],
                $body['customer_phone'],
                $body['customer_email'] ?? null,
                $body['delivery_address'],
                $body['order_note'] ?? null,
                $totalAmount,
            ]);

            $orderId = $db->lastInsertId();

            $stmt = $db->prepare(
                "INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, subtotal)
                 VALUES (?, ?, ?, ?, ?, ?)"
            );
            foreach ($orderItems as $item) {
                $stmt->execute([
                    $orderId,
                    $item['product_id'],
                    $item['product_name'],
                    $item['product_price'],
                    $item['quantity'],
                    $item['subtotal'],
                ]);
            }

            $db->commit();

            respond([
                'message' => 'Order placed successfully',
                'order_id' => (int) $orderId,
                'total_amount' => $totalAmount,
            ], 201);

        } catch (Exception $e) {
            $db->rollBack();
            respond(['error' => 'Failed to create order: ' . $e->getMessage()], 500);
        }
        break;

    case 'PUT':
        requireAuth();
        if (!$id) respond(['error' => 'Order ID required'], 400);

        $body = getBody();
        $status = $body['status'] ?? null;
        $validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

        if (!$status || !in_array($status, $validStatuses)) {
            respond(['error' => 'Valid status required: ' . implode(', ', $validStatuses)], 400);
        }

        $stmt = $db->prepare("UPDATE orders SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);

        $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$id]);
        $order = $stmt->fetch();

        if (!$order) respond(['error' => 'Order not found'], 404);
        $order['total_amount'] = (float) $order['total_amount'];

        respond($order);
        break;

    case 'DELETE':
        requireAuth();
        if (!$id) respond(['error' => 'Order ID required'], 400);

        $stmt = $db->prepare("DELETE FROM orders WHERE id = ?");
        $stmt->execute([$id]);

        respond(['message' => 'Order deleted']);
        break;

    default:
        respond(['error' => 'Method not allowed'], 405);
}