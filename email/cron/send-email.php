<?php
require '/usr/local/src/the-lunch-picker/email/EmailTask.php';

//
// sends a specific email template with data to subscribers in database
// this script should ideally be run on a cron
//
// subscribers will not get more than 1 message per day
//

const SENDGRID_EMAIL_TEMPLATE_ID = 'd-f46651a0c58047e4a30d9681eb27ce37';

$success = true;

echo "Starting..", PHP_EOL, PHP_EOL;
$emailTask = new EmailTask();

if (empty($argv[1])) {
    echo 'Sending test email', PHP_EOL, PHP_EOL;
    $emailTask->isTestRun = true;
}

try {
    $emailTask->run();
} catch (Exception $e) {
    $success = false;
    echo $e->getMessage(), PHP_EOL, PHP_EOL;
    $emailTask->closeDbConnection();
}


$emailTask->closeDbConnection();
if ($success) {
    echo "✓ Finished successfully", PHP_EOL;
} else {
    echo "Ｘ Finished with errors!", PHP_EOL;
}
