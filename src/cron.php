<?php
// Include files
include 'lib/sparrow.php';
include 'config.php';

// Connect to db
$db = new Sparrow();
$db->setDb($config['db']);
$db->sql('SET NAMES utf8')->execute();

// GC
$db->from('content')->where(array('expired <' => time()))->delete()->execute();
