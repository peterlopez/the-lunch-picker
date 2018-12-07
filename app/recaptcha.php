<?php

$RECAPTCHA_SECRET = getenv('RECAPTCHA_SECRET');
if (empty($RECAPTCHA_SECRET)) {
    header("Location: http://" . $_SERVER['HTTP_HOST']);
    return;
}

// Check whether request contains
// required POST parameters
$isValidRequest = !empty($_POST['token']);
if (!$isValidRequest) {
    // respond with error
}

// Make request to Google

// Send response
