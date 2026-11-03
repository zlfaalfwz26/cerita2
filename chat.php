<?php

header('Content-Type: application/json');

// API Key OpenRouter
$api_key = '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'; 
$model = 'deepseek/deepseek-v4.1-flash'; 

$data = json_decode(file_get_contents('php://input'), true);
$user_message = isset($data['message']) ? $data['message'] : '';

if (empty($user_message)) {
    echo json_encode(['error' => 'Pesan kosong']);
    exit;
}

$payload = json_encode([
    'model' => $model,
    'messages' => [
        [
            'role' => 'system', 
            'content' => 'Kamu adalah teman curhat yang berempati, pendengar yang baik, dan menenangkan. Gunakan bahasa Indonesia yang santai, hangat, dan tidak menghakimi.'
        ],
        [
            'role' => 'user', 
            'content' => $user_message
        ]
    ]
]);

$ch = curl_init('https://openrouter.ai/api/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $api_key,
    'HTTP-Referer: http://localhost', 
    'X-Title: Tempatnya Cerita', 
    'Content-Type: application/json'
]);

$response = curl_exec($ch);

if(curl_errno($ch)){
    echo json_encode(['error' => curl_error($ch)]);
} else {
    echo $response;
}
curl_close($ch);
?>
