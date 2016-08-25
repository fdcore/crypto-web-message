#!/usr/bin/env php

<?php

$path = dirname(__FILE__);

include $path . '/src/lib/Tiny.php';

echo "Generating TinyPHP Random Set...\n";

$set = Tiny::generate_set();

echo "Set Generated\n";
echo "Set: {$set} \n\n";
