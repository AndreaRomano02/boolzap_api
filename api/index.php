<?php
$database_url = '../db/data.json';

$json = file_get_contents($database_url);

echo $json;
