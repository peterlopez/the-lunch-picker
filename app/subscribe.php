<?php
require '/usr/local/src/the-lunch-picker/email/EmailTask.php';

header('Content-Type: application/json');
ini_set('display_errors', 'Off');

$formSubmitted = !empty($_POST['subscribe']);
$formIsValid = !empty($_POST['email']) && !empty($_POST['cuisines']) && !empty($_POST['location']);

// shouldn't be here
if ($formSubmitted === false) {
    header("Location: http://" . $_SERVER['HTTP_HOST']);
    return;
}

// error in POST submission
if ($formSubmitted && $formIsValid === false) {
    echo json_encode(['error' => 'Did not receive proper POST data']);
    return;
}

// save subscriber to DB
if ($formSubmitted && $formIsValid) {
    try {
        $emailTask = new EmailTask();
        $emailTask->subscribe($_POST['email'], $_POST['cuisines'], $_POST['location']);
        $emailTask->closeDbConnection();
        echo json_encode(['status' => 'success']);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
        return;
    }
}
