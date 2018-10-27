<?php
header('Content-Type: application/json');

const BASE_URL = 'https://api.yelp.com/v3/businesses/search';

// Filters
$cuisines = $_GET['cuisines'];
if (empty($cuisines)) {
    $cuisines = ['restaurants'];
}

$location = $_GET['location'];
if (empty($location)) {
    $location = "San+Fransisco";
}

$geolocation = $_GET['geolocation'];

$requestUrl = buildRequestUrl($cuisines, $location, $geolocation);
makeRequest($requestUrl);


/**
 * @param string|bool $url
 */
function makeRequest($url = false)
{
    $credentials = file_get_contents('yelp-credentials.json');
    $credentials = json_decode($credentials, true);
    $apiKey = $credentials['api_key'];

    $ch = curl_init($url);
    $headers = array(
        'Content-type: application/json',
        'Authorization: Bearer '.$apiKey,
    );
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_VERBOSE, true);

    $result = curl_exec($ch);
    echo $result;

//    var_dump(curl_getinfo($ch));

    curl_close($ch);
}

/**
 * @param $cuisines
 * @param $location
 * @return string
 */
function buildRequestUrl($cuisines, $location, $geolocation)
{
    $url = BASE_URL;

    $url .= '?term=lunch';

    $url .= '&categories=';
    foreach($cuisines as $cuisine) {
        $url .= $cuisine.",";
    }
    $url = substr($url, 0, -1);


    if (!empty($geolocation)) {
        $geolocation = json_decode($geolocation, true);
        $url .= "&latitude=".$geolocation['lat'];
        $url .= "&longitude=".$geolocation['lng'];
    } else {
        $url .= "&location=".urlencode($location);
    }

    return $url;
}
