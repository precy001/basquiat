<?php
$db = getDB();

switch ($method) {

    // GET /api/orders — list all orders (admin only)
    // GET /api/orders/{id} — get single order with items (admin only)
    case 'GET':
        requireAuth();

        if ($id) {
            $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
            $stmt->execute([$id]);
            $order = $stmt->fetch();
            if (!$order) respond(['error' => 'Order not found'], 404);

            $order['total_amount'] = (float) $order['total_amount'];

            // Get order items
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
            // Optional filters
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
                // Get item count
                $countStmt = $db->prepare("SELECT COUNT(*) as count FROM order_items WHERE order_id = ?");
                $countStmt->execute([$order['id']]);
                $order['item_count'] = (int) $countStmt->fetch()['count'];
            }

            respond($orders);
        }
        break;

    // POST /api/orders — create new order (public)
    case 'POST':
        $body = getBody();

        // Validate required fields
        $required = ['customer_name', 'customer_phone', 'delivery_address', 'items'];
        foreach ($required as $field) {
            if (empty($body[$field])) {
                respond(['error' => "$field is required"], 400);
            }
        }

        if (!is_array($body['items']) || count($body['items']) === 0) {
            respond(['error' => 'At least one item is required'], 400);
        }

        // Calculate total
        $totalAmount = 0;
        $orderItems = [];
        foreach ($body['items'] as $item) {
            if (empty($item['product_id']) || empty($item['quantity'])) {
                respond(['error' => 'Each item needs product_id and quantity'], 400);
            }

            // Verify product exists and get current price
            $stmt = $db->prepare("SELECT * FROM products WHERE id = ? AND is_active = 1");
            $stmt->execute([$item['product_id']]);
            $product = $stmt->fetch();

            if (!$product) {
                respond(['error' => "Product ID {$item['product_id']} not found"], 400);
            }

            $subtotal = $product['price'] * $item['quantity'];
            $totalAmount += $subtotal;

            $orderItems[] = [
                'product_id' => $product['id'],
                'product_name' => $product['name'],
                'product_price' => $product['price'],
                'quantity' => $item['quantity'],
                'subtotal' => $subtotal,
            ];
        }

        // Insert order
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

            // Insert order items
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
            respond(['error' => 'Failed to create order'], 500);
        }
        break;

    // PUT /api/orders/{id} — update order status (admin only)
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

    // DELETE /api/orders/{id} — delete order (admin only)
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
