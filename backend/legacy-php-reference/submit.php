<?php
declare(strict_types=1);

/**
 * JSON receiver for the Vue Contact Us and Checkout forms.
 * Requires public/api/config.php (copy from config.example.php) and PDO MySQL.
 */
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

$configPath = __DIR__ . '/config.php';
$config = is_file($configPath) ? require $configPath : [];
$allowedOrigins = is_array($config['allowed_origins'] ?? null) ? $config['allowed_origins'] : [];
$origin = trim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''));

if ($origin !== '') {
    if (!in_array($origin, $allowedOrigins, true)) {
        respond(403, ['ok' => false, 'error' => 'This website is not allowed to submit forms.']);
    }
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($method !== 'POST') {
    header('Allow: POST, OPTIONS');
    respond(405, ['ok' => false, 'error' => 'Method not allowed.']);
}
if (!is_file($configPath) || !is_array($config)) {
    respond(500, ['ok' => false, 'error' => 'The submission service is not configured. Please contact the site administrator.']);
}

$rawBody = file_get_contents('php://input');
if ($rawBody === false || strlen($rawBody) > 65536) {
    respond(413, ['ok' => false, 'error' => 'The submission is too large.']);
}
$data = json_decode($rawBody, true);
if (!is_array($data) || json_last_error() !== JSON_ERROR_NONE) {
    respond(400, ['ok' => false, 'error' => 'Invalid JSON request body.']);
}

function textField(array $source, string $key, int $maxLength = 2048): string
{
    $value = $source[$key] ?? '';
    if (!is_string($value) && !is_numeric($value)) {
        return '';
    }
    $value = trim((string) $value);
    if (strlen($value) > $maxLength) {
        $value = function_exists('mb_substr') ? mb_substr($value, 0, $maxLength, 'UTF-8') : substr($value, 0, $maxLength);
    }
    return $value;
}

function nullableValue(string $value): ?string
{
    return $value === '' ? null : $value;
}

function detectAgent(string $ua): array
{
    if (preg_match('/iPhone|Android.*Mobile/i', $ua)) {
        $device = 'Mobile';
    } elseif (preg_match('/iPad|Tablet|Android/i', $ua)) {
        $device = 'Tablet';
    } else {
        $device = 'Desktop';
    }

    if (preg_match('/Edg/i', $ua)) {
        $browser = 'Edge';
    } elseif (preg_match('/OPR|Opera/i', $ua)) {
        $browser = 'Opera';
    } elseif (preg_match('/Firefox/i', $ua)) {
        $browser = 'Firefox';
    } elseif (preg_match('/Chrome|CriOS/i', $ua)) {
        $browser = 'Chrome';
    } elseif (preg_match('/Safari/i', $ua)) {
        $browser = 'Safari';
    } elseif (preg_match('/MSIE|Trident/i', $ua)) {
        $browser = 'Internet Explorer';
    } else {
        $browser = 'Unknown';
    }

    if (preg_match('/iPhone/i', $ua)) {
        $os = 'iOS (iPhone)';
    } elseif (preg_match('/iPad/i', $ua)) {
        $os = 'iOS (iPad)';
    } elseif (preg_match('/Android/i', $ua)) {
        $os = 'Android';
    } elseif (preg_match('/Windows/i', $ua)) {
        $os = 'Windows';
    } elseif (preg_match('/Mac OS X|Macintosh/i', $ua)) {
        $os = 'macOS';
    } elseif (preg_match('/Linux/i', $ua)) {
        $os = 'Linux';
    } else {
        $os = 'Unknown';
    }

    return ['device' => $device, 'browser' => $browser, 'operating_system' => $os];
}

function createConnection(array $config): PDO
{
    foreach (['db_host', 'db_name', 'db_user', 'db_pass'] as $key) {
        if (!array_key_exists($key, $config) || !is_string($config[$key])) {
            throw new RuntimeException('Missing database configuration key: ' . $key);
        }
    }
    $port = (int) ($config['db_port'] ?? 3306);
    $dsn = 'mysql:host=' . $config['db_host'] . ';port=' . $port . ';dbname=' . $config['db_name'] . ';charset=utf8mb4';
    return new PDO($dsn, $config['db_user'], $config['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
}

function metadataParameters(array $meta): array
{
    $params = [];
    foreach ($meta as $key => $value) {
        $params[':' . $key] = $value;
    }
    return $params;
}

function requestMetadata(array $data): array
{
    $tracking = is_array($data['tracking'] ?? null) ? $data['tracking'] : [];
    $utmSource = textField($tracking, 'utm_source', 255);
    $referrer = textField($tracking, 'referrer', 2048);
    $source = $utmSource !== '' ? $utmSource : ($referrer !== '' ? $referrer : 'direct');
    $ua = textField(['ua' => ($_SERVER['HTTP_USER_AGENT'] ?? '')], 'ua', 512);
    $agent = detectAgent($ua);
    $ip = trim((string) ($_SERVER['REMOTE_ADDR'] ?? ''));
    if (!filter_var($ip, FILTER_VALIDATE_IP)) {
        $ip = '';
    }
    return [
        'source' => substr($source, 0, 2048),
        'utm_source' => nullableValue($utmSource),
        'referrer' => nullableValue($referrer),
        'gclid' => nullableValue(textField($tracking, 'gclid', 255)),
        'msclkid' => nullableValue(textField($tracking, 'msclkid', 255)),
        'url_source' => nullableValue(textField($tracking, 'url_source', 2048)),
        'device' => $agent['device'],
        'browser' => $agent['browser'],
        'operating_system' => $agent['operating_system'],
        'ip_address' => nullableValue($ip),
        'user_agent' => nullableValue($ua),
    ];
}

$formType = textField($data, 'form_type', 32);
if (!in_array($formType, ['contact', 'order'], true)) {
    respond(422, ['ok' => false, 'error' => 'Unknown form type.']);
}

// Drop the contact honeypot quietly without inserting a database row.
if ($formType === 'contact' && textField($data, 'website', 255) !== '') {
    respond(201, ['ok' => true, 'id' => null]);
}

$topics = [
    'Order status or shipping',
    'Return or refund',
    'Product question',
    'Warranty claim',
    'Wholesale or partnership',
    'Something else',
];

if ($formType === 'contact') {
    $firstName = textField($data, 'first_name', 100);
    $lastName = textField($data, 'last_name', 100);
    $email = textField($data, 'email', 254);
    $orderNumber = textField($data, 'order_number', 80);
    $topic = textField($data, 'topic', 80);
    $message = textField($data, 'message', 10000);

    if ($firstName === '' || $lastName === '' || $email === '' || $topic === '' || $message === '') {
        respond(422, ['ok' => false, 'error' => 'Please complete all required contact fields.']);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(422, ['ok' => false, 'error' => 'Please enter a valid email address.']);
    }
    if (!in_array($topic, $topics, true)) {
        respond(422, ['ok' => false, 'error' => 'Please select a valid contact topic.']);
    }
    if (strlen($message) < 2) {
        respond(422, ['ok' => false, 'error' => 'Please enter a little more detail in your message.']);
    }

    try {
        $pdo = createConnection($config);
        $meta = requestMetadata($data);
        $sql = 'INSERT INTO contact_submissions
            (first_name, last_name, email, order_number, topic, message,
             source, utm_source, referrer, gclid, msclkid, url_source,
             device, browser, operating_system, ip_address, user_agent)
            VALUES
            (:first_name, :last_name, :email, :order_number, :topic, :message,
             :source, :utm_source, :referrer, :gclid, :msclkid, :url_source,
             :device, :browser, :operating_system, :ip_address, :user_agent)';
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array_merge([
            ':first_name' => $firstName,
            ':last_name' => $lastName,
            ':email' => $email,
            ':order_number' => nullableValue($orderNumber),
            ':topic' => $topic,
            ':message' => $message,
        ], metadataParameters($meta)));
        respond(201, ['ok' => true, 'id' => (int) $pdo->lastInsertId()]);
    } catch (Throwable $error) {
        error_log('Contact submission insert failed: ' . $error->getMessage());
        respond(500, ['ok' => false, 'error' => 'We could not save your message. Please try again.']);
    }
}

$customer = is_array($data['customer'] ?? null) ? $data['customer'] : [];
$address = is_array($data['shipping_address'] ?? null) ? $data['shipping_address'] : [];
$shipping = is_array($data['shipping'] ?? null) ? $data['shipping'] : [];
$firstName = textField($customer, 'first_name', 100);
$lastName = textField($customer, 'last_name', 100);
$email = textField($customer, 'email', 254);
$phone = textField($customer, 'phone', 40);
$address1 = textField($address, 'address1', 255);
$address2 = textField($address, 'address2', 255);
$city = textField($address, 'city', 100);
$state = textField($address, 'state', 3);
$zip = textField($address, 'zip', 20);
$shippingMethod = textField($shipping, 'method', 20);
$notes = textField($data, 'notes', 5000);
$acceptedTerms = filter_var($data['accepted_terms'] ?? false, FILTER_VALIDATE_BOOLEAN);

if ($firstName === '' || $lastName === '' || $email === '' || $phone === '' ||
    $address1 === '' || $city === '' || $state === '' || $zip === '') {
    respond(422, ['ok' => false, 'error' => 'Please complete all required checkout fields.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'error' => 'Please enter a valid email address.']);
}
if (strlen(preg_replace('/\D/', '', $phone)) < 10) {
    respond(422, ['ok' => false, 'error' => 'Please enter a valid phone number.']);
}
if (!preg_match('/^\d{5}(?:-\d{4})?$/', $zip)) {
    respond(422, ['ok' => false, 'error' => 'Please enter a valid US ZIP code.']);
}
if (!preg_match('/^[A-Z]{2}$/', strtoupper($state))) {
    respond(422, ['ok' => false, 'error' => 'Please select a valid state.']);
}
if (!in_array($shippingMethod, ['standard', 'expedited', 'priority'], true)) {
    respond(422, ['ok' => false, 'error' => 'Please select a valid shipping method.']);
}
if (!$acceptedTerms) {
    respond(422, ['ok' => false, 'error' => 'Please agree to the store policies before placing the order.']);
}
$items = $data['items'] ?? null;
if (!is_array($items) || count($items) < 1 || count($items) > 100) {
    respond(422, ['ok' => false, 'error' => 'Your order must contain between 1 and 100 items.']);
}

$normalizedItems = [];
$subtotal = 0.0;
foreach ($items as $item) {
    if (!is_array($item)) {
        respond(422, ['ok' => false, 'error' => 'One of the order items is invalid.']);
    }
    $sku = textField($item, 'sku', 80);
    $name = textField($item, 'name', 255);
    $qty = filter_var($item['qty'] ?? null, FILTER_VALIDATE_INT);
    $priceRaw = $item['price'] ?? null;
    if ($sku === '' || $name === '' || $qty === false || $qty < 1 || $qty > 99 ||
        !is_numeric($priceRaw) || !is_finite((float) $priceRaw) || (float) $priceRaw < 0 || (float) $priceRaw > 250000) {
        respond(422, ['ok' => false, 'error' => 'One of the order items has invalid details.']);
    }
    $price = round((float) $priceRaw, 2);
    $lineTotal = round($price * $qty, 2);
    $subtotal = round($subtotal + $lineTotal, 2);
    $normalizedItems[] = ['sku' => $sku, 'name' => $name, 'qty' => $qty, 'price' => $price, 'line_total' => $lineTotal];
}

$shippingCost = 0.0;
if ($shippingMethod === 'standard') {
    $shippingCost = $subtotal >= 50 ? 0.0 : 5.95;
} elseif ($shippingMethod === 'expedited') {
    $shippingCost = 12.95;
} elseif ($shippingMethod === 'priority') {
    $shippingCost = 24.95;
}
$total = round($subtotal + $shippingCost, 2);
if ($total > 5000000) {
    respond(422, ['ok' => false, 'error' => 'This order is above the supported order value. Please contact customer support.']);
}

try {
    $orderNumber = 'RV-' . gmdate('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
    $pdo = createConnection($config);
    $meta = requestMetadata($data);
    $pdo->beginTransaction();

    $sql = 'INSERT INTO store_orders
        (order_number, email, phone, first_name, last_name, street_address, address_line2,
         city, state, postal_code, shipping_method, shipping_cost, subtotal, total, notes,
         payment_method, status, payment_status, accepted_terms,
         source, utm_source, referrer, gclid, msclkid, url_source,
         device, browser, operating_system, ip_address, user_agent)
        VALUES
        (:order_number, :email, :phone, :first_name, :last_name, :street_address, :address_line2,
         :city, :state, :postal_code, :shipping_method, :shipping_cost, :subtotal, :total, :notes,
         :payment_method, :status, :payment_status, :accepted_terms,
         :source, :utm_source, :referrer, :gclid, :msclkid, :url_source,
         :device, :browser, :operating_system, :ip_address, :user_agent)';
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array_merge([
        ':order_number' => $orderNumber,
        ':email' => $email,
        ':phone' => $phone,
        ':first_name' => $firstName,
        ':last_name' => $lastName,
        ':street_address' => $address1,
        ':address_line2' => nullableValue($address2),
        ':city' => $city,
        ':state' => strtoupper($state),
        ':postal_code' => $zip,
        ':shipping_method' => $shippingMethod,
        ':shipping_cost' => number_format($shippingCost, 2, '.', ''),
        ':subtotal' => number_format($subtotal, 2, '.', ''),
        ':total' => number_format($total, 2, '.', ''),
        ':notes' => nullableValue($notes),
        ':payment_method' => 'invoice',
        ':status' => 'pending_review',
        ':payment_status' => 'not_paid',
        ':accepted_terms' => 1,
    ], metadataParameters($meta)));
    $orderId = (int) $pdo->lastInsertId();

    $itemStmt = $pdo->prepare('INSERT INTO store_order_items
        (order_id, sku, product_name, quantity, unit_price, line_total)
        VALUES (:order_id, :sku, :product_name, :quantity, :unit_price, :line_total)');
    foreach ($normalizedItems as $item) {
        $itemStmt->execute([
            ':order_id' => $orderId,
            ':sku' => $item['sku'],
            ':product_name' => $item['name'],
            ':quantity' => $item['qty'],
            ':unit_price' => number_format($item['price'], 2, '.', ''),
            ':line_total' => number_format($item['line_total'], 2, '.', ''),
        ]);
    }
    $pdo->commit();
    respond(201, [
        'ok' => true,
        'id' => $orderId,
        'order_number' => $orderNumber,
        'subtotal' => number_format($subtotal, 2, '.', ''),
        'shipping_cost' => number_format($shippingCost, 2, '.', ''),
        'total' => number_format($total, 2, '.', ''),
        'status' => 'pending_review',
        'created_at' => gmdate(DATE_ATOM),
    ]);
} catch (Throwable $error) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Order submission insert failed: ' . $error->getMessage());
    respond(500, ['ok' => false, 'error' => 'We could not save your order request. Please try again.']);
}
