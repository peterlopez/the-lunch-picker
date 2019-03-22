<?php
require '/usr/local/src/the-lunch-picker/email/EmailTask.php';

header('Content-Type: application/json');
ini_set('display_errors', 'Off');

// validate POST data
$formSubmitted = !empty($_POST['subscribe']);
$honeypotEmpty = empty($_POST['email']); // honeypot field should always be blank
$formIsInvalid = empty($_POST['realemailaddress']) || empty($_POST['cuisines']) || empty($_POST['location']);

// shouldn't be here
if ($formSubmitted === false) {
    header("Location: http://" . $_SERVER['HTTP_HOST']);
    return;
}

// error in POST submission
if ($formIsInvalid || !$honeypotEmpty) {
    $response = [
        'status' => 'error',
        'message' => 'Did not receive valid POST data'
    ];

    echo json_encode($response);
    return;
}

// we have a valid request
// save subscriber to DB
$response = [];
try {
    $emailTask = new EmailTask();
    $emailTask->subscribe($_POST['email'], $_POST['cuisines'], $_POST['location']);
    $emailTask->closeDbConnection();
    $response['status'] = 'success';
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
    return;
}
echo json_encode($response);

return;
