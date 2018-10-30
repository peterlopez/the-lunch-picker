<?php
header('Content-Type: application/json');
ini_set('display_errors', 'Off');

$yelp = new Yelp();
$yelp->run();

class Yelp
{
    const BASE_URL = 'https://api.yelp.com/v3/businesses/search';

    // Filters
    private $cuisines = [];
    private $location = '';
    private $geolocation = '';
    private $radius = '';
    private $price = [];

    /**
     * Makes API request based on GET parameters
     */
    public function run()
    {
        try {
            $this->setFilters($_GET);
            $requestUrl = $this->buildRequestUrl();
            $this->makeRequest($requestUrl);
        } catch(Exception $e) {
            http_response_code(500);
            die(json_encode(array('message' => $e->getMessage(), 'code' => 500)));
        }
    }

    /**
     * Set filters from GET parameters with default values
     *
     * @param array $getParams
     * @return void
     */
    protected function setFilters($getParams)
    {
        $this->cuisines = $getParams['cuisines'];
        if (empty($this->cuisines)) {
            $this->cuisines = ['restaurants'];
        }

        $this->location = $getParams['location'];
        if (empty($this->location)) {
            $this->location = "San+Fransisco";
        }

        // Don't set default value
        $this->geolocation = $getParams['geolocation'];

        $this->radius = $getParams['radius'];
        if (empty($this->radius)) {
            $this->radius = '';
        }

        $this->price = $getParams['price'];
        if (empty($this->price)) {
            $this->price = [1,2];
        }
    }


    /**
     * @param string|bool $url
     * @throws Exception
     */
    protected function makeRequest($url = false)
    {
        if (empty($url)) {
            throw new Exception('ERROR: request URL is empty');
        }

        $apiKey = $this->getYelpApiToken();

        $ch = curl_init($url);
        $headers = array(
            'Content-type: application/json',
            'Authorization: Bearer '.$apiKey,
        );
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        //curl_setopt($ch, CURLOPT_VERBOSE, true);

        $result = curl_exec($ch);
        echo $result;

        curl_close($ch);
    }

    /**
     * @return string
     * @throws Exception
     */
    protected function getYelpApiToken()
    {
        $credentials = file_get_contents('/etc/opt/yelp-credentials.json');
        $credentials = json_decode($credentials, true);
        $apiKey = $credentials['api_key'];
        if (empty($apiKey)) {
            throw new Exception("ERROR: API credentials not found");
        }

        return $apiKey;
    }

    /**
     * @return string
     */
    protected function buildRequestUrl()
    {
        $url = self::BASE_URL;

        // Term (hardcoded)
        $url .= '?term=lunch';

        // Cuisines
        $url .= '&categories='.implode(",", $this->cuisines);

        // Geolocation OR Location
        // prioritize geolocation over location
        if (!empty($this->geolocation)) {
            $geolocation = json_decode($this->geolocation, true);
            $url .= "&latitude=".$geolocation['lat'];
            $url .= "&longitude=".$geolocation['lng'];
        } else {
            $url .= "&location=".urlencode($this->location);
        }

        // Radius
        if (!empty($this->radius)) {
            $url .= "&radius=$this->radius";
        }

        // Price
        if (!empty($this->price)) {
            $url .= "&price=".implode(",", $this->price);
        }

        return $url;
    }
}
