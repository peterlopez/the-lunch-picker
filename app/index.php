<!DOCTYPE html>
<html lang="en">
<head>
    <title>The Lunch Picker</title>

    <meta charset="UTF-8">
    <meta name="author" content="Peter Lopez">
    <meta name="description" content="Find a bite to eat">
    <meta name="keywords" content="lunch,picker,lunch picker">
    <meta property="og:site_name" content="The Lunch Picker" />
    <meta property="og:title" content="The Lunch Picker" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="http://thelunchpicker.com/assets/img/advert.png" />
    <meta property="og:image:secure_url" content="https://thelunchpicker.com/assets/img/advert.png" />
    <meta property="og:image:width" content="1267" />
    <meta property="og:image:height" content="316" />
    <meta property="og:description" content="Find a bite to eat" />
    <meta property="og:url" content="https://thelunchpicker.com" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="shortcut icon" href="assets/favicon.ico">

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
<div id="main" class="page">
    <div class="wrapper">
        <!-- Header -->
        <div id="header" class="container no-padding">
            <div id="logo-container">
                <img id="logo" src="assets/img/logo.svg" alt="" title="" />
            </div>

            <div class="toolbar">
                <form id="filter-form" action="./yelp" method="get">
                    <div id="filters">
                        <!-- cuisines filter -->
                        <div class="filter-container">
                            <div class="cuisines filter btn btn-outline-primary">
                                <p class="filter-title">Cuisines</p>
                                <p class="filter-title blank">&nbsp;</p>
                                <div class="cuisines-list flyout">
                                    <label for="id_1_cuisines__allcheckbox">
                                        <input id="id_1_cuisines__allcheckbox" class="all-checkbox" type="checkbox" name="all-cuisines" value="all" checked />
                                        All
                                    </label>
                                    <label for="cuisine-tradamerican">
                                        <input id="cuisine-tradamerican" type="checkbox" name="cuisines[]" value="tradamerican" checked />
                                        American
                                    </label>
                                    <label for="cuisine-bbq">
                                        <input id="cuisine-bbq" type="checkbox" name="cuisines[]" value="bbq" checked />
                                        BBQ
                                    </label>
                                    <label for="cuisine-pizza">
                                        <input id="cuisine-pizza" type="checkbox" name="cuisines[]" value="pizza" checked />
                                        Pizza
                                    </label>
                                    <label for="cuisine-delis">
                                        <input id="cuisine-delis" type="checkbox" name="cuisines[]" value="delis" checked />
                                        Delis
                                    </label>
                                    <label for="cuisine-indian">
                                        <input id="cuisine-indian" type="checkbox" name="cuisines[]" value="indpak" checked />
                                        Indian
                                    </label>
                                    <label for="cuisine-hotdogs">
                                        <input id="cuisine-hotdogs" type="checkbox" name="cuisines[]" value="hotdogs" checked />
                                        Fast Food
                                    </label>
                                    <label for="cuisine-japanese">
                                        <input id="cuisine-japanese" type="checkbox" name="cuisines[]" value="japanese" checked />
                                        Japanese
                                    </label>
                                    <label for="cuisine-italian">
                                        <input id="cuisine-italian" type="checkbox" name="cuisines[]" value="italian" checked />
                                        Italian
                                    </label>
                                    <label for="cuisine-mediterranean">
                                        <input id="cuisine-mediterranean" type="checkbox" name="cuisines[]" value="mediterranean" checked />
                                        Mediterranean
                                    </label>
                                    <label for="cuisine-mexican">
                                        <input id="cuisine-mexican" type="checkbox" name="cuisines[]" value="mexican" checked />
                                        Mexican
                                    </label>
                                    <label for="cuisine-vegan">
                                        <input id="cuisine-vegan" type="checkbox" name="cuisines[]" value="vegan" checked />
                                        Vegan
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- location filter -->
                        <div class="filter-container">
                            <div id="location" class="filter btn btn-outline-primary">
                                <p class="filter-title">Location</p>
                                <p class="filter-title blank">&nbsp;</p>
                                <div class="location-content flyout">
                                    <button type="button" class="geolocate btn btn-link">locate me</button>
                                    <p class="geolocation-error" style="display: none;">error fetching geolocation</p>
                                    <input class="newsletter__locationinput" type="text" name="location" autocomplete="address-level2" placeholder="San Fransisco, CA" />
                                    <img class="loading-spinner" src="assets/img/loading.svg" alt="" title="" style="display: none;" />
                                    <input type="hidden" name="geolocation" />
                                </div>
                            </div>
                        </div>

                        <!-- price filter -->
                        <div class="filter-container">
                            <div id="price" class="filter btn btn-outline-primary">
                                <p class="filter-title">&nbsp;</p>
                                <p class="filter-title blank">&nbsp;</p>
                                <div class="prices-list flyout">
                                    <label for="price-1">
                                        <input id="price-1" type="radio" name="price" value="1" />
                                        &nbsp;&dollar;
                                    </label>
                                    <label for="price-2">
                                        <input id="price-2" type="radio" name="price" value="2" />
                                        &nbsp;&dollar;&dollar;
                                    </label>
                                    <label for="price-3">
                                        <input id="price-3" type="radio" name="price" value="3" />
                                        &nbsp;&dollar;&dollar;&dollar;
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- apply button -->
                    <div id="filter-apply-btn-container">
                        <button id="btn-filter-apply" class="btn btn-success" style="display: none;" type="button">apply</button>
                    </div>
                </form>

                <div class="action-buttons">
                    <!-- spin button -->
                    <div id="spin-btn-container">
                        <button type="button" id="btn-spin" class="btn btn-primary" disabled>spin!</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="line top-line"></div>

        <!-- Spinner -->
        <div id="spinner" class="loading">
            <!-- Loading screen -->
            <div class="loading-container">
                <img class="loading-spinner" src="assets/img/loading.svg" alt="" title="" />
                <p class="loading-text">Loading..</p>
            </div>
        </div>

        <!-- Loading screen -->
        <!-- original copy that gets cloned into spinner -->
        <div class="loading-container" style="display: none">
            <img class="loading-spinner" src="assets/img/loading.svg" alt="" title="" />
            <p class="loading-text">Loading..</p>
        </div>

        <div class="line bottom-line"></div>

        <!-- footer -->
        <div id="footer">
            <div class="footer-left">
                <p class="newsletter__link">
                    <button class="btn btn-link"
                       data-featherlight=".newsletter__form"
                       data-featherlight-persist="true"
                       data-featherlight-variant="newsletter">subscribe</button>
                    for email notifications
                </p>

                <!-- Newsletter signup form (displayed in modal) -->
                <div class="newsletter">
                    <form class="newsletter__form" action="subscribe" method="post">
                        <input type="hidden" name="subscribe" value="1" />
                        <p class="newsletter__explaintext">Have a random lunch selection emailed to you every day at noon!</p>

                        <!-- Step 1 -->
                        <div class="newsletter__step" data-step="1">
                            <div class="email-input-step">
                                <p class="step__header">1. your email</p>

                                <!-- HONEYPOT should stay empty -->
                                <input type="email" name="email" value="" style="display: none;" title="" tabindex="-1" />

                                <!-- REAL EMAIL FIELD -->
                                <input class="newsletter__emailinput form-control" type="email" name="realemailaddress" autocomplete="email" placeholder="your@email.com" value="" required />
                                <button class="btn btn-primary" type="button" data-next-step="2" disabled>continue</button>
                            </div>
                        </div>

                        <!-- Step 2 -->
                        <div class="newsletter__step hidden" data-step="2">
                            <div class="location-content">
                                <p class="step__header">2. your city</p>
                                <label for="id_newsletter__locationinput">
                                    <input type="text" class="newsletter__locationinput form-control" name="location" required autocomplete="address-level2" placeholder="San Fransisco, CA" id="id_newsletter__locationinput" tabindex="0" />
                                </label>
                                <button class="btn btn-secondary" type="button" data-prev-step="1">back</button>
                                <button class="btn btn-primary" type="button" data-next-step="3" disabled>continue</button>
                            </div>
                        </div>

                        <!-- Step 3 -->
                        <div class="newsletter__step hidden" data-step="3">
                            <div class="cuisines">
                                <p class="step__header">3. what do you like to eat?</p>
                                <div class="cuisines__list">
                                    <label for="id_2_cuisines__allcheckbox">
                                        <input id="id_2_cuisines__allcheckbox" class="cuisines__allcheckbox" type="checkbox" name="all-cuisines" value="all" checked />
                                        All
                                    </label>
                                    <label for="email-cuisine-tradamerican">
                                        <input id="email-cuisine-tradamerican" type="checkbox" name="cuisines[]" value="tradamerican" checked />
                                        American
                                    </label>
                                    <label for="email-cuisine-bbq">
                                        <input id="email-cuisine-bbq" type="checkbox" name="cuisines[]" value="bbq" checked />
                                        BBQ
                                    </label>
                                    <label for="email-cuisine-pizza">
                                        <input id="email-cuisine-pizza" type="checkbox" name="cuisines[]" value="pizza" checked />
                                        Pizza
                                    </label>
                                    <label for="email-cuisine-delis">
                                        <input id="email-cuisine-delis" type="checkbox" name="cuisines[]" value="delis" checked />
                                        Delis
                                    </label>
                                    <label for="email-cuisine-indian">
                                        <input id="email-cuisine-indian" type="checkbox" name="cuisines[]" value="indpak" checked />
                                        Indian
                                    </label>
                                    <label for="email-cuisine-hotdogs">
                                        <input id="email-cuisine-hotdogs" type="checkbox" name="cuisines[]" value="hotdogs" checked />
                                        Fast Food
                                    </label>
                                    <label for="email-cuisine-japanese">
                                        <input id="email-cuisine-japanese" type="checkbox" name="cuisines[]" value="japanese" checked />
                                        Japanese
                                    </label>
                                    <label for="email-cuisine-italian">
                                        <input id="email-cuisine-italian" type="checkbox" name="cuisines[]" value="italian" checked />
                                        Italian
                                    </label>
                                    <label for="email-cuisine-mediterranean">
                                        <input id="email-cuisine-mediterranean" type="checkbox" name="cuisines[]" value="mediterranean" checked />
                                        Mediterranean
                                    </label>
                                    <label for="email-cuisine-mexican">
                                        <input id="email-cuisine-mexican" type="checkbox" name="cuisines[]" value="mexican" checked />
                                        Mexican
                                    </label>
                                    <label for="email-cuisine-vegan">
                                        <input id="email-cuisine-vegan" type="checkbox" name="cuisines[]" value="vegan" checked />
                                        Vegan
                                    </label>
                                </div>
                                <button class="btn btn-secondary" type="button" data-prev-step="2">back</button>
                                <button class="btn btn-primary" type="submit">Submit</button>
                            </div>
                        </div>

                        <div class="newsletter__confirm hidden">
                            <p class="checkmark">&#10004;</p>
                            <p>success!</p>
                            <button type="button" class="btn btn-success">close</button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="footer-right">
                <p class="yelp-credentials">restaurants provided by <img src="assets/img/yelp_logo.png" alt="Yelp" title="Yelp"></p>
            </div>
        </div>
    </div>
</div>

<!-- JS libraries -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script src="vendor/featherlight/featherlight.min.js"></script>
<script src="vendor/js.cookie.min.js"></script>

<!-- App JS -->
<?php if($_SERVER['SERVER_NAME'] === "localhost"): ?>
<script async src="build/production.js"></script>
<?php else: ?>
<script async src="build/production.min.js"></script>
<?php endif; ?>
</body>
</html>
