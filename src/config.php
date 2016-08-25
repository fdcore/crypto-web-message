<?php

$config = array();

$config['db'] = array(
      'type'     => 'mysqli',
      'hostname' => 'localhost',
      'database' => 'YOUR_DATABASE',
      'username' => 'YOUR_USERNAME',
      'password' => 'YOUR_PASSWORD'
  );

/*
  use command
  ```
    php gen_secret.php
  ```
*/
$config['tiny_secret'] = '07HKBP6CnEmIVrwLvJstDfGYey3Uh5bRqac12puNgkMAi4TdS8QOzjl9oXxWZF';
