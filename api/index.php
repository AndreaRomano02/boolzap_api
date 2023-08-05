<?php
$database_url = '../db/data.json';

$json = file_get_contents($database_url);

$messages = json_decode($json, true);


$new_message = $_POST['message'] ?? NULL;
$current_id = $_POST['id'] ?? NULL;

if ($new_message && $current_id) {
  foreach ($messages as $i => $message) {
    if ($message['id'] == $current_id) {
      $messages[$i]['messages'][] = [
        'id' => uniqid(),
        'status' => 'sent',
        'message' => $new_message,
        'date' => date('Y-m-d H:i:s')
      ];
    }
  }
  $json_messages = json_encode($messages);

  file_put_contents($database_url, $json_messages);

  header('Content-Type: application/json'); // Comunico che uso un linguaggio JSON 
  echo $json_messages;
}

echo $json;
