<?php
header('Content-Type: application/json');
ini_set('display_errors', 'Off');

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

try {
    $requestUrl = buildRequestUrl($cuisines, $location, $geolocation);
    makeRequest($requestUrl);
} catch(Exception $e) {
    http_response_code(500);
    die(json_encode(array('message' => $e->getMessage(), 'code' => 500)));
}

/**
 * @param string|bool $url
 * @throws Exception
 */
function makeRequest($url = false)
{
    $credentials = file_get_contents('/etc/opt/yelp-credentials.json');
    $credentials = json_decode($credentials, true);
    $apiKey = $credentials['api_key'];
    if (empty($apiKey)) {
        throw new Exception("ERROR: API credentials not found");
    }

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

    curl_close($ch);
}

/**
 * @param $cuisines
 * @param $location
 * @param $geolocation
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
