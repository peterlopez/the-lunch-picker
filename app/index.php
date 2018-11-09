<!DOCTYPE html>
<html>
<head>
    <title>The Lunch Picker</title>

    <meta charset="UTF-8">
    <meta name="author" content="Peter Lopez">
    <meta name="description" content="Find a bite to eat">
    <meta name="keywords" content="lunch,picker,lunch picker">
    <link rel="shortcut icon" href="assets/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

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
                <svg id="logo" version="1.1" viewBox="0 0 170 35" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" fill-rule="evenodd">
                        <path d="m111.8 18.5c0-2.4-4.7-4.4-10.6-4.4-0.9 0-1.8 0-2.6 0.1l-7.6-2.4c-1.1-0.4-2.5 0.1-2.5 0.1l-6.4 2.6c-1.8-0.4-3.7-0.6-5.7-0.6-8.2 0-14.8 3.5-14.8 7.8 0 1.1 0.4 2.1 1.1 3v1.3c0.1 1.4 0.2 1.7 0.2 1.7 2 3.5 9.9 2.3 9.9 2.3 1.3 4.4 9.3 4.3 9.3 4.3 10.2 0.1 10.7-3.8 10.7-3.8s13.9-5.2 15.3-5.9 1.6-1.9 1.6-1.9 0-0.6-0.1-1.7c1.5-0.7 2.2-1.6 2.2-2.5z" fill="#221F1F"/>
                        <ellipse cx="89.4" cy="23.1" rx="8.9" ry="3.5" fill="#ECB1B0"/>
                        <ellipse cx="100.8" cy="18.4" rx="10.2" ry="3.6" fill="#ECB1B0"/>
                        <ellipse cx="76.2" cy="20.4" rx="14.8" ry="7.8" fill="#ECB1B0"/>
                        <path d="m76.2 28.8c-8.6 0-15.3-3.7-15.3-8.4s6.7-8.4 15.3-8.4 15.3 3.7 15.3 8.4-6.7 8.4-15.3 8.4zm0-15.7c-7.9 0-14.3 3.3-14.3 7.3s6.4 7.3 14.3 7.3 14.3-3.3 14.3-7.3-6.5-7.3-14.3-7.3z" fill="#221F1F" fill-rule="nonzero"/>
                        <g transform="translate(75 13)" fill="#221F1F">
                            <polyline points="0.9 12.1 0.9 13.3 7.3 16.3 38.7 1.9 38.7 0.7"/>
                            <path d="m7.3 16.8c-0.1 0-0.2 0-0.2-0.1l-6.4-3c-0.2-0.1-0.3-0.3-0.3-0.5v-1.2c0-0.3 0.2-0.5 0.5-0.5s0.5 0.2 0.5 0.5v1l5.9 2.7 30.9-14.2v-0.8c0-0.3 0.2-0.5 0.5-0.5s0.5 0.2 0.5 0.5v1.1c0 0.2-0.1 0.4-0.3 0.5h-0.1l-31.3 14.5h-0.2z"/>
                        </g>
                        <g transform="translate(56 15)" fill="#221F1F">
                            <path d="m1.2 1.5v1.2l10.7 5c0.8-0.2 1.8-0.3 2.8-0.3 3.2 0 5.2 1.2 5.6 2.4l0.8 1h3.8l10.9-4.2"/>
                            <path d="m24.9 11.3h-3.8c-0.2 0-0.3-0.1-0.4-0.2l-0.8-1s-0.1-0.1-0.1-0.2c-0.4-1-2.1-2.1-5.1-2.1-0.9 0-1.9 0.1-2.7 0.3h-0.4l-10.7-5c-0.2-0.1-0.3-0.3-0.3-0.5v-1.2c0-0.3 0.2-0.5 0.5-0.5s0.5 0.2 0.5 0.5v0.8l10.2 4.8c0.9-0.2 1.8-0.3 2.8-0.3 3.7 0 5.6 1.4 6.1 2.7l0.6 0.7h3.4l10.8-4.1c0.3-0.1 0.6 0 0.7 0.3s0 0.6-0.3 0.7l-10.9 4.2c0 0.1-0.1 0.1-0.1 0.1z"/>
                        </g>
                        <path d="m63.4 13.8l-6.2 2.7 10.7 5c0.8-0.2 1.8-0.3 2.8-0.3 3.2 0 5.9 1.2 5.9 2.8 0 0.5-0.3 0.9-0.7 1.3l6.4 3 31.4-14.4c-0.7-0.2-1.2-0.5-1.2-1 0-0.3 0.3-0.6 0.8-0.8l-3.8-1.3" fill="#FFEDCA"/>
                        <path d="m82.3 28.7c-0.1 0-0.2 0-0.2-0.1l-6.4-3c-0.2-0.1-0.3-0.2-0.3-0.4s0-0.4 0.2-0.5c0.2-0.2 0.5-0.5 0.5-0.9 0-1-2.2-2.2-5.3-2.2-0.9 0-1.9 0.1-2.7 0.3h-0.4l-10.7-5c-0.2-0.1-0.3-0.3-0.3-0.5s0.1-0.4 0.3-0.5l6.2-2.7c0.3-0.1 0.6 0 0.7 0.3s0 0.6-0.3 0.7l-5.1 2.2 9.4 4.4c0.9-0.2 1.8-0.3 2.8-0.3 3.7 0 6.4 1.4 6.4 3.3 0 0.4-0.1 0.8-0.4 1.1l5.5 2.6 30.1-13.8c-0.3-0.3-0.5-0.6-0.5-1 0-0.2 0.1-0.4 0.2-0.6l-2.9-0.9c-0.3-0.1-0.4-0.4-0.3-0.7s0.4-0.4 0.7-0.3l3.8 1.3h0.1l0.3 0.3c0.1 0.2 0 0.4-0.1 0.6-0.1 0.1-0.1 0.1-0.2 0.1-0.3 0.1-0.4 0.3-0.4 0.3 0 0.1 0.2 0.3 0.8 0.4 0.2 0 0.3 0.1 0.4 0.3 0.1 0.3 0.1 0.6-0.2 0.7h-0.1l-31.4 14.4c-0.1 0.1-0.1 0.1-0.2 0.1z" fill="#221F1F"/>
                        <path d="m82.3 29.8c-0.3 0-0.5-0.2-0.5-0.5v-1.2c0-0.3 0.2-0.5 0.5-0.5s0.5 0.2 0.5 0.5v1.2c0 0.3-0.2 0.5-0.5 0.5zm31-15.7c-0.3 0-0.5-0.2-0.5-0.5v-1.7c0-0.3 0.2-0.5 0.5-0.5s0.5 0.2 0.5 0.5v1.7c0 0.3-0.2 0.5-0.5 0.5zm-45.4 9c-0.3 0-0.5-0.2-0.5-0.5v-1.2c0-0.3 0.2-0.5 0.5-0.5s0.5 0.2 0.5 0.5v1.2c0 0.3-0.2 0.5-0.5 0.5zm23.5-22.1l17.4 6.3s1 0.4 1 2.3v3.1s-0.2 1.2-1.6 1.8-15.2 5.5-15.2 5.5-1.3 5.1-11.4 4.6c0 0-8-0.2-9.2-4.7 0 0-7.4 0.5-9.2-3.1 0 0-0.5-1.3-0.5-2.7v-2.3s-0.5-5.6 9.9-4.8l16.3-6s1.4-0.4 2.5 0z" fill="#221F1F" fill-rule="nonzero"/>
                        <path d="m90.7 1.9l17.2 6.1s1.3 0.4 0 1-16.9 6.3-16.9 6.3 0.3 5.6-12.4 3.8c0 0-7.8-1.3-4.4-5.4 0 0-6.4 1.5-9.5-1.4-2.1-2 3-5.6 8.2-4.1l16.4-6.3c0.1 0 0.7-0.2 1.4 0z" fill="#DBBDA0"/>
                        <ellipse cx="70.7" cy="10.6" rx="1" ry="1" fill="#B3947C"/>
                        <ellipse cx="76.2" cy="14.4" rx="1" ry="1" fill="#B3947C"/>
                        <ellipse cx="69.7" cy="24.8" rx="1" ry="1" fill="#DB8E8E"/>
                        <ellipse cx="65.7" cy="23.6" rx="1" ry="1" fill="#DB8E8E"/>
                        <ellipse cx="79.6" cy="10.7" rx="1" ry="1" fill="#B3947C"/>
                        <ellipse cx="82.1" cy="6.5" rx="1" ry="1" fill="#B3947C"/>
                        <ellipse cx="85.1" cy="9.2" rx="1" ry="1" fill="#B3947C"/>
                        <ellipse cx="91.3" cy="4.3" rx="1" ry="1" fill="#B3947C"/>
                        <ellipse cx="86.6" cy="17.4" rx="1" ry="1" fill="#B3947C"/>
                        <ellipse cx="73.8" cy="26.6" rx="1" ry="1" fill="#DB8E8E"/>
                        <ellipse cx="94.1" cy="25.5" rx="1" ry="1" fill="#DB8E8E"/>
                        <ellipse cx="109.2" cy="19.4" rx="1" ry="1" fill="#DB8E8E"/>
                        <ellipse cx="105" cy="20.3" rx="1" ry="1" fill="#DB8E8E"/>
                        <ellipse cx="98.6" cy="9.5" rx="1.1" ry="1" fill="#B3947C"/>
                        <g transform="translate(0 6)" fill="#5E5E5E" fill-rule="nonzero">
                            <path d="m12.6 0.4c0.9 0 1.7 0.7 1.7 1.9 0 2.3-2.3 4.3-5.1 5.3-0.1 1-0.3 3.2-0.4 3.8 4.1 0.6 5.2 3.4 5.2 5.3 0 2.3-1.9 3.6-2.2 3.6s-0.6-0.3-0.6-0.6c0-0.2 0.1-0.4 0.3-0.5 1-0.7 1.5-1.6 1.5-2.6 0-1.5-0.8-3.7-4.3-4.2-1 4.4-2.7 6.6-5.4 6.6-1.4 0-2.6-1-2.6-2.6 0-2.1 2.1-5.1 7-5 0.1-0.8 0.2-1.1 0.3-3.5-0.5 0.1-1 0.1-1.5 0.1-2.3 0-4-1.2-4-3.4 0-0.3 0.2-0.6 0.6-0.6 0.3 0 0.5 0.3 0.5 0.6 0 1.9 1.8 2.3 2.9 2.3 0.6 0 1.1-0.1 1.6-0.2 0.4-3.5 2.2-6.3 4.5-6.3zm-5.1 12.1c-3.9 0-5.7 2.2-5.7 3.9 0 1 0.7 1.5 1.5 1.5 2.1 0 3.5-1.9 4.2-5.4zm5.6-10.2c0-0.5-0.3-0.8-0.7-0.8-0.9 0-2.5 1.1-3.1 4.9 2.2-0.8 3.8-2.6 3.8-4.1zm4.4 8c-0.3 1.1-0.6 2.9-0.6 4.4 0 1.2 0.2 2.4 1.1 2.4 1.6 0 3.1-3.3 3.6-7.3 0.1-0.3 0.3-0.5 0.7-0.5 0.3 0 0.5 0.3 0.4 0.6 0 0.3-0.2 1.2-0.4 2.1-0.2 1.4-0.4 2.5-0.4 3.4 0 0.8 0.2 1.4 0.5 1.7 0.1 0.1 0.1 0.3 0.1 0.4 0 0.3-0.3 0.6-0.6 0.6-0.5 0-1.2-1.1-1.1-2.5-0.7 1.6-1.7 2.5-2.9 2.5-0.9 0-2.2-0.6-2.2-3.5 0-1.7 0.4-3.6 0.6-4.5 0.1-0.2 0.1-0.6 0.6-0.6 0.3 0 0.6 0.3 0.6 0.6v0.2zm13.6 2.5c0 1.8-0.4 3.8-0.6 4.6-0.1 0.6-0.5 0.6-0.5 0.6-0.3 0-0.6-0.3-0.6-0.6v-0.1c0.2-0.9 0.6-2.8 0.6-4.4 0-1.3-0.3-2.3-0.9-2.3-1.4 0-3 2.9-3.8 7-0.1 0.2-0.3 0.4-0.6 0.4s-0.5-0.3-0.5-0.6 0.5-2.1 0.6-2.5c0.3-1.1 0.5-2.2 0.5-3.1 0-0.8-0.1-1.2-0.5-1.5-0.1-0.1-0.1-0.3-0.1-0.4 0-0.3 0.3-0.5 0.6-0.5 0.5 0 1.2 0.9 1.1 2.4 0.7-1.6 1.7-2.4 2.8-2.4 0.5 0 1.9 0.3 1.9 3.4zm8.1-2.2c0 0.3-0.2 0.6-0.5 0.6-0.2 0-0.4-0.1-0.5-0.3-0.2-0.3-0.4-0.5-0.9-0.5-2 0-3 2.6-3 4.5 0 2 1.1 2.3 1.7 2.3 0.7 0 1.6-0.4 2.1-1.3 0.1-0.2 0.3-0.3 0.5-0.3 0.3 0 0.5 0.3 0.5 0.6 0 0.5-1.2 2-3.1 2-1.6 0-2.7-1-2.7-3.3 0-2.7 1.7-5.6 4.2-5.6 1 0 1.5 0.4 1.7 0.9v0.4zm2 7c-0.1-0.8-0.2-1.2-0.2-2.1 0-2.8 0.6-6 0.8-7.1h-0.7c-0.5 0-1 0-1-0.6 0-0.3 0.3-0.6 0.5-0.5h0.5c0.3 0 0.7 0 1-0.1 0.8-2.5 2.3-5.3 4.3-5.3 1.1 0 1.7 0.7 1.7 1.7 0 2-2.6 3.9-5.1 4.6-0.2 0.9-0.6 2.7-0.9 5.1 0.8-2.5 2.3-4.1 3.7-4.1 2 0 2 2.6 2 3.7 0 2.1-0.5 4.2-0.6 4.4-0.1 0.3-0.3 0.4-0.5 0.4-0.3 0-0.6-0.3-0.6-0.6v-0.2c0.2-0.8 0.6-2.5 0.6-4.1 0-1.9-0.3-2.6-1-2.6-1.6 0-3.8 4.2-3.4 7 0.1 0.3-0.2 0.6-0.5 0.6-0.3 0.2-0.5 0-0.6-0.2zm2.2-10.6c2-0.7 3.7-2.1 3.7-3.4 0-0.4-0.2-0.7-0.6-0.7-1 0.1-2.3 1.8-3.1 4.1z"/>
                        </g>
                        <g transform="translate(122 7)">
                            <path d="m13.9 6.4c0 2.9-2.8 4.5-4.5 4.5-0.3 0-0.6-0.3-0.6-0.6s0.2-0.5 0.5-0.5c1.4-0.1 3.4-1.3 3.4-3.4 0-2-1.5-3.4-3.7-3.4-1.1 0-2.2 0.3-3.1 0.8 1 1.9 1.5 4.5 1.5 7.1 0 4.6-1.4 7.3-3.6 7.3-1.9 0-3.1-1.7-3.1-5.3 0-3.2 1.2-7 3.8-9.3-0.7-0.9-1.8-1.6-3-1.6-0.3 0-0.6-0.2-0.6-0.5s0.3-0.6 0.6-0.6c1.5 0 2.9 0.8 3.8 2 1.1-0.6 2.3-1 3.7-1 2.9 0.1 4.9 2 4.9 4.5zm-8.8-1.9c-2.3 2.1-3.2 5.8-3.2 8.3 0 2.2 0.6 4.4 2 4.4 1.3 0 2.4-2.3 2.4-6.1 0.1-2.3-0.3-4.8-1.2-6.6zm11.6 5.6v0.1c-0.5 1.8-0.9 5.1-1.1 7.5 0 0.3-0.3 0.5-0.6 0.5s-0.6-0.3-0.6-0.6 0.4-4.7 1.1-7.7c0.1-0.3 0.4-0.5 0.7-0.4s0.5 0.3 0.5 0.6zm7.8 0.5c0 0.3-0.2 0.6-0.5 0.6-0.2 0-0.4-0.1-0.5-0.3-0.2-0.3-0.4-0.5-0.9-0.5-2 0-3 2.6-3 4.5 0 2 1.1 2.3 1.7 2.3 0.7 0 1.6-0.4 2.1-1.3 0.1-0.2 0.3-0.3 0.5-0.3 0.3 0 0.5 0.3 0.5 0.6 0 0.5-1.2 2-3.1 2-1.6 0-2.7-1-2.7-3.3 0-2.7 1.7-5.6 4.2-5.6 1 0 1.5 0.4 1.7 0.9-0.1 0.1 0 0.3 0 0.4zm3.7 5.6c0 0.7 0.1 0.9 0.1 1 0.1 0.1 0.1 0.2 0.1 0.3 0 0.3-0.3 0.6-0.6 0.6-0.7 0-0.8-1.1-0.8-1.8 0-0.5 0.1-1.2 0.2-1.9-1.3-0.4-1.8-1.2-1.8-1.9 0-1.1 0.9-2 2.5-2 0.1-0.6 0.3-1.2 0.4-1.7 0.5-2.3 0.8-3.6 0.8-4.6 0-0.5 0-0.8-0.1-1 0-0.1-0.1-0.2-0.1-0.2 0-0.3 0.2-0.5 0.4-0.5h0.2c0.7 0 0.7 0.9 0.7 1.7 0 1.2-0.4 2.8-0.7 4.3-0.2 0.6-0.3 1.3-0.5 2.2 1 0.2 1.8 0.9 2.3 1.5 0.5-0.5 1.1-1.4 1.2-2.3 0-0.3 0.2-0.5 0.5-0.5s0.6 0.3 0.6 0.6c0 1.1-1 2.6-1.7 3.1 1 1.3 1.5 3.1 1.5 4.6 0 0.6-0.4 0.6-0.6 0.6-0.1 0-0.5 0-0.5-0.6 0-1.3-0.4-2.8-1.2-3.9-0.6 0.4-1.6 0.9-2.8 0.9 0 0.4-0.1 1-0.1 1.5zm-0.8-2.9c0.1-0.6 0.2-1.3 0.4-1.9-0.6 0-1.2 0.4-1.2 1 0 0.2 0.1 0.5 0.3 0.6 0.1 0.1 0.3 0.2 0.5 0.3zm1.2 0.1c0.8 0 1.6-0.3 2.1-0.8-0.4-0.5-1.1-1.1-1.8-1.2-0.2 0.7-0.3 1.4-0.3 2zm11.6-2.1c0-0.5-0.4-0.9-1-0.9-1.3 0-3.1 1.6-3.1 4.3 0 0.9 0.3 2.4 2.1 2.4 0.7 0 1.3-0.3 1.8-0.8 0.1-0.1 0.2-0.2 0.4-0.2 0.3 0 0.5 0.3 0.5 0.6 0 0.5-1.2 1.5-2.7 1.5-1.9 0-3.2-1.3-3.2-3.4 0-3.2 2.2-5.4 4.2-5.4 1.5 0 2.1 0.9 2.1 1.9 0 2-2.1 3-3.6 3-0.3 0-0.6-0.2-0.6-0.5s0.2-0.5 0.6-0.6c1.3-0.1 2.5-0.8 2.5-1.9zm3.5 6.3c-0.1 0.3-0.3 0.5-0.6 0.5s-0.5-0.3-0.5-0.6c0-0.2 0.7-4.3 0.7-5.1 0-1.1-0.2-1.5-0.6-1.9-0.1-0.1-0.2-0.3-0.2-0.4 0-0.3 0.3-0.6 0.5-0.6 0.5 0 1.2 0.9 1.1 2.1 0.6-1.7 1.9-2.4 3.2-2.4 0.3 0 0.6 0.2 0.6 0.6 0 0.3-0.2 0.5-0.5 0.5-2.6 0.2-3.1 3.2-3.7 6.5v0.8z" fill="#5E5E5E" fill-rule="nonzero"/>
                            <circle cx="16.7" cy="7.1" r="1" fill="#fff"/>
                        </g>
                    </g>
                </svg>
            </div>

            <div id="toolbar">
                <form id="filter-form" action="./yelp.php" method="get">
                    <div id="filters" class="">
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
                                    <input type="text" name="location" autocomplete="address" placeholder="San Fransisco, CA" />
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

<!-- jQuery -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>

<!-- library styles and JS -->
<link rel="stylesheet" href="lib/vendor.css" type="text/css">
<script src="lib/featherlight/featherlight.min.js" type="text/javascript"></script>
<script src="lib/js.cookie.min.js" type="text/javascript"></script>

<!-- App styles and JS -->
<?php if($_SERVER['SERVER_NAME'] === "localhost"): ?>
<link rel="stylesheet" href="css/production.css" type="text/css">
<script async src="js/production.js" type="text/javascript"></script>
<?php else: ?>
<link rel="stylesheet" href="css/production.min.css" type="text/css">
<script async src="js/production.min.js" type="text/javascript"></script>
<?php endif; ?>
</body>
</html>
