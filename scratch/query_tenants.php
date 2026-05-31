<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();

$tables = DB::select('SHOW TABLES');
echo "Tables in landlord:\n";
foreach ($tables as $table) {
    echo array_values((array)$table)[0] . "\n";
}
