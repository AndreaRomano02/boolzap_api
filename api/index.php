<?php
$database_url = '../db/data.json';

$json = file_get_contents($database_url);

$messages = json_decode($json, true);

$new_message = $_POST['message'] ?? NULL;
$current_id = $_POST['id'] ?? NULL;

if ($new_message && $current_id) {
  foreach ($messages as $i => $message) {
    if ($message['id'] == $current_id) {
      $new_message_data = [
        'id' => uniqid(),
        'status' => 'sent',
        'message' => $new_message,
        'date' => date('d-m-Y H:i:s')
      ];
      $messages[$i]['messages'][] = $new_message_data;
      $json_messages = json_encode($new_message_data); // Ottieni solo il nuovo messaggio appena aggiunto
      break; // Esci dal ciclo dopo aver trovato il contatto corrente
    }
  }

  file_put_contents($database_url, json_encode($messages)); // Salva l'array completo aggiornato nel file
} else {
  // Se non viene aggiunto un nuovo messaggio, restituisci l'intero array di messaggi
  $json_messages = $json;
}

// Invia i dati al client e pulisci il buffer di output
ob_start();
header('Content-Type: application/json'); // Comunico che uso un linguaggio JSON
echo $json_messages;
