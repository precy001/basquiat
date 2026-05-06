<?php
// POST /api/seed — Seeds the database with all 28 products
// Run ONCE then delete this file!

require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['error' => 'Method not allowed'], 405);
}

$db = getDB();

// Check if products already exist
$stmt = $db->query("SELECT COUNT(*) as count FROM products");
$count = (int) $stmt->fetch()['count'];

if ($count > 0) {
    respond(['error' => "Database already has $count products. Clear them first or delete this file."], 403);
}

$products = [
    ["Camo Royale Tote", 35000, "Tote", ["/assets/bag_1_i.png", "/assets/bag_1_iv.png"]],
    ["Urban Drift Clutch", 18500, "Clutch", ["/assets/bag_2_i.png"]],
    ["Sovereign Sling", 22000, "Sling", ["/assets/bag_3_i.png"]],
    ["Crown Jewel Satchel", 45000, "Satchel", ["/assets/bag_4_i.jpeg", "/assets/bag_4_ii.jpeg", "/assets/bag_4_iii.jpeg", "/assets/bag_4_iv.jpeg"]],
    ["Street King Pouch", 12000, "Pouch", ["/assets/bag_5_i.png"]],
    ["Gilded Edge Crossbody", 28000, "Crossbody", ["/assets/bag_6_i.png"]],
    ["Throne Room Duffle", 52000, "Duffle", ["/assets/bag_7_i.png", "/assets/bag_7_ii.png"]],
    ["Empire State Backpack", 38000, "Backpack", ["/assets/bag_8_i.png", "/assets/bag_8_ii.jpeg", "/assets/bag_8_iii.png"]],
    ["Golden Era Mini", 15000, "Mini", ["/assets/bag_9_i.PNG"]],
    ["Rebel Canvas Tote", 32000, "Tote", ["/assets/bag_10_i.jpeg", "/assets/bag_10_ii.jpeg"]],
    ["Monarch Shoulder Bag", 27500, "Shoulder", ["/assets/bag_11_i.png", "/assets/bag_11_ii.png"]],
    ["Graffiti Queen Clutch", 19000, "Clutch", ["/assets/bag_12_i.png", "/assets/bag_12_ii.png"]],
    ["Dynasty Crossbody", 26000, "Crossbody", ["/assets/bag_13_i.png", "/assets/bag_13_ii.png"]],
    ["Noble Crest Satchel", 41000, "Satchel", ["/assets/bag_14_i.png", "/assets/bag_14_ii.png"]],
    ["Crown Heights Weekender", 58000, "Weekender", ["/assets/bag_15_iv.jpeg", "/assets/bag_15_iii.jpeg", "/assets/bag_15_ii.jpeg", "/assets/bag_15_i.jpeg"]],
    ["Luxe Patrol Pouch", 14500, "Pouch", ["/assets/bag_16_i.png"]],
    ["Artisan Reign Tote", 33000, "Tote", ["/assets/bag_17_i.png"]],
    ["Velvet Throne Clutch", 21000, "Clutch", ["/assets/bag_18_i.jpeg"]],
    ["Prestige Sling", 24000, "Sling", ["/assets/bag_19_i.png"]],
    ["Royal Flush Mini", 16500, "Mini", ["/assets/bag_20_i.png"]],
    ["Heritage Duffle", 49000, "Duffle", ["/assets/bag_21_i.png", "/assets/bag_21_ii.png"]],
    ["Palace Guard Crossbody", 29000, "Crossbody", ["/assets/bag_22_i.png"]],
    ["Crowned Glory Shoulder", 31000, "Shoulder", ["/assets/bag_23_i.png"]],
    ["Gilt Trip Backpack", 42000, "Backpack", ["/assets/bag_24_i.png"]],
    ["Sovereignty Pouch", 13500, "Pouch", ["/assets/bag_25_i.png"]],
    ["Imperial Mark Sling", 23000, "Sling", ["/assets/bag_26_i.png"]],
    ["Basquiat Signature", 65000, "Signature", ["/assets/bag_27_i.png"]],
    ["King's Ransom Tote", 37000, "Tote", ["/assets/bag_28_i.png", "/assets/bag_28_ii.png"]],
];

$desc = "Premium handcrafted bag from the Basquiat collection. Designed with meticulous attention to detail, featuring durable materials and a signature aesthetic that blends street culture with luxury craftsmanship.";

$stmt = $db->prepare(
    "INSERT INTO products (name, price, category, description, images) VALUES (?, ?, ?, ?, ?)"
);

$inserted = 0;
foreach ($products as $p) {
    $stmt->execute([$p[0], $p[1], $p[2], $desc, json_encode($p[3])]);
    $inserted++;
}

respond([
    'message' => "$inserted products seeded successfully",
    'warning' => 'Delete api/seed.php now!',
]);