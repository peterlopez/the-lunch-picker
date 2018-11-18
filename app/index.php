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

            <div id="toolbar">
                <form id="filter-form" action="./yelp.php" method="get">
                    <div id="filters">
                        <!-- cuisines filter -->
                        <div class="filter-container">
                            <div id="cuisines" class="filter btn btn-outline-primary">
                                <p class="filter-title">Cuisines</p>
                                <p class="filter-title blank">&nbsp;</p>
                                <div class="cuisines-list flyout">
                                    <label>
                                        <input class="all-checkbox" type="checkbox" name="all-checkbox" value="all" checked />
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
                                    <a class="geolocate" href="#" title="">locate me</a>
                                    <p class="geolocation-error" style="display: none;">error fetching geolocation</p>
                                    <input type="text" name="location" autocomplete="address-level2" placeholder="San Fransisco, CA" />
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
            <p class="yelp-credentials">restaurants provided by <img src="assets/img/yelp_logo.png" alt="Yelp" title="Yelp"></p>
            <p>created by Peter Lopez</p>
        </div>
    </div>
</div>

<!-- JS libraries -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script src="lib/featherlight/featherlight.min.js"></script>
<script src="lib/js.cookie.min.js"></script>

<!-- App JS -->
<?php if($_SERVER['SERVER_NAME'] === "localhost"): ?>
<script async src="build/production.js"></script>
<?php else: ?>
<script async src="build/production.min.js"></script>
<?php endif; ?>
</body>
</html>
