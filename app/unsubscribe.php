<?php
require '/usr/local/src/the-lunch-picker/email/EmailTask.php';

$formSubmitted = !empty($_POST['unsubscribe']);
$formIsValid = !empty($_POST['email']) && !empty($_POST['unsubscribe_token']);

if ($formSubmitted && $formIsValid === false) {
    $_SESSION['error'] = true;
    $_SESSION['success'] = false;
}

if ($formSubmitted && $formIsValid) {
    $success = true;

    try {
        $emailTask = new EmailTask();

        if($emailTask->validateUnsubscribeToken($_POST['email'], $_POST['unsubscribe_token'])) {
            $emailTask->unsubscribe($_POST['email']);
            $emailTask->closeDbConnection();
        }
    } catch (Exception $e) {
        $success = false;
        $_SESSION['error_message'] = $e->getMessage();
        $_GET['email'] = $_POST['email'];
        $_GET['token'] = $_POST['unsubscribe_token'];
    }

    // display error message
    if (!$success) {
        $_SESSION['error'] = true;
        $_SESSION['success'] = false;
    }

    // display success message
    if ($success) {
        $_SESSION['success'] = true;
        $_SESSION['error'] = false;
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>The Lunch Picker</title>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="shortcut icon" href="favicon.ico">

    <!-- CSS libraries -->
    <link rel="stylesheet" href="build/vendor.css" type="text/css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

    <!-- App CSS -->
    <?php if($_SERVER['SERVER_NAME'] === "localhost"): ?>
    <link rel="stylesheet" href="build/production.css" type="text/css">
    <?php else: ?>
    <link rel="stylesheet" href="build/production.min.css" type="text/css">
    <?php endif; ?>

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-109653890-2"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-109653890-2');
    </script>
</head>
<body>
<div id="unsubscribe" class="page">
    <div class="wrapper">
        <!-- Header -->
        <div id="header" class="container no-padding">
            <div id="logo-container">
                <a href="/"><img id="logo" src="assets/img/logo.svg" alt="" title="" /></a>
            </div>
        </div>

        <div id="form-container">
            <h2>Unsubscribe</h2>
        <?php if ($_SESSION['success']): ?>
            <p class="success-banner"><?php echo $_POST['email'] ?> successfully removed from the mailing list.</p>
            <p><a class="btn btn-success" href="/">Find Lunch</a></p>
        <?php endif; ?>
        <?php if ($_SESSION['error']): ?>
            <p class="error-banner">
                Error processing request. Try again later.<br/>
                <span class="mono-font"><?php echo $_SESSION['error_message']; ?></span>
            </p>
        <?php endif; ?>
        <?php if (empty($_SESSION['success'])): ?>
            <p class="description">Enter your email address below to stop receiving daily lunch emails.</p>
            <form action="unsubscribe.php" method="post">
                <input type="hidden" name="unsubscribe" value="1" />
                <input type="hidden" name="unsubscribe_token" value="<?php echo $_GET['token']; ?>" />
                <input type="email" required autocomplete="on" name="email" title="email" value="<?php echo $_GET['email']; ?>" />
                <input class="btn btn-primary" type="submit" />
            </form>
        <?php endif; ?>
        </div>
    </div>
</div>
