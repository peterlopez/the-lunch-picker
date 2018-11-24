<?php
require '/usr/local/src/the-lunch-picker/email/EmailTask.php';

//
// sends a specific email template with data to subscribers in database
// this script should ideally be run on a cron
//
// subscribers will not get more than 1 message per day
//

$templateId = getenv('EMAIL_TEMPLATE_DAILY_RANDOM_LUNCH');

$success = true;

echo "Starting..", PHP_EOL, PHP_EOL;
$emailTask = new EmailTask();

if (empty($argv[1])) {
    echo 'Sending test email', PHP_EOL, PHP_EOL;
    $emailTask->isTestRun = true;
}

try {
    $emailTask->setTemplateId($templateId);
    $emailTask->sendDailyRandomLunchEmail();
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
