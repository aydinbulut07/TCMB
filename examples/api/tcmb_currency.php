<?php

/*
This file is used to pass cross site request prevention by modern browsers
*/
header('Content-type: application/xml');
echo file_get_contents('http://www.tcmb.gov.tr/kurlar/today.xml');