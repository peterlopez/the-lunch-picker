<?php
header('Content-Type: application/json');
ini_set('display_errors', 'Off');

$yelp = new Yelp();
$yelp->run();

/**
 * Class Yelp
 * Shim for Yelp Business and Search API
 *
 * @see https://www.yelp.com/developers/documentation/v3/business_search
 */
class Yelp
{
    const YELP_SEARCH_URL = 'https://api.yelp.com/v3/businesses/search';
    const YELP_BUSINESS_URL = 'https://api.yelp.com/v3/businesses/';

    /**
     * @var bool determines if request is made to Yelp business details API
     */
    protected $isBusinessRequest = false;

    //
    // Yelp Business API filter
    //

    protected $businessId = '';


    //
    // YELP Search API filters
    //

    /**
     * @var array $cuisines use specific Yelp terms for cuisines (categories)
     */
    private $cuisines = [];

    /**
     * @var string includes city, state, or anything really
     */
    private $location = '';

    /**
     * @var string $geolocation JSON encoded lat and lng figures
     */
    private $geolocation = '';

    /**
     * @var int $radius
     */
    private $radius = '';

    /**
     * @var array of amounts selected:
     *      1 = $  2 = $$  3 = $$$
     *      v
     *      ($, $$)
     *      v
     *      (1, 2)
     */
    private $price = [];

    /**
     * Makes API request based on GET parameters
     */
    public function run()
    {
        try {
            // 1
            $this->parseGetParams($_GET);

//            var_dump($_GET); die;
            // 2
            if ($this->isBusinessRequest) {
                $requestUrl = $this->buildBusinessRequestUrl();
            }
            else {
                $requestUrl = $this->buildSearchRequestUrl();
            }

            // 3
//            var_dump($requestUrl);
//            die;
            $responseData = $this->makeRequest($requestUrl);

            // 4
            $this->jsonOutput($this->isBusinessRequest, $responseData);

        } catch(Exception $e) {
            http_response_code(500);
            die(json_encode(array('message' => $e->getMessage(), 'code' => 500)));
        }
    }

    /**
     * Set Yelp Business and Search API filters
     * from GET parameters
     *
     * @param array $getParams
     * @return void
     */
    protected function parseGetParams($getParams)
    {
        //
        // Yelp Business details API
        //
        $this->businessId = (isset($getParams['business']) && !empty($getParams['business'])) ? $getParams['business'] : "";
        if (!empty($this->businessId)) {
            $this->isBusinessRequest = true;
        }

        //
        // Yelp Search API parameters
        //
        $this->cuisines = (isset($getParams['cuisines']) && !empty($getParams['cuisines'])) ? $getParams['cuisines'] : ['restaurants'];
        $this->location = (isset($getParams['location']) && !empty($getParams['location'])) ? $getParams['location'] : "San+Fransisco";
        $this->price = (isset($getParams['price']) && !empty($getParams['price'])) ? array($getParams['price']) : [1,2];
        // No default value
        $this->radius = (isset($getParams['radius']) && !empty($getParams['radius'])) ? $getParams['radius'] : "";
        $this->geolocation = (isset($getParams['geolocation']) && !empty($getParams['geolocation'])) ? $getParams['geolocation'] : "";
    }


    /**
     * @param string|bool $url
     * @return array response data
     * @throws Exception
     */
    protected function makeRequest($url = false)
    {
        if (empty($url)) {
            throw new Exception('ERROR: request URL is empty');
        }

        // Get Yelp auth token
        $apiKey = $this->getYelpApiToken();

        // Build request to Yelp
        $ch = curl_init($url);
        $headers = array(
            'Content-type: application/json',
            'Authorization: Bearer '.$apiKey,
        );
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        // Make request and get response
        $response = json_decode(curl_exec($ch), true);

        curl_close($ch);

        return $response;
    }

    /**
     * @return string
     * @throws Exception
     */
    protected function getYelpApiToken()
    {
        $apiKey = getenv('YELP_TOKEN');
        if (empty($apiKey)) {
            throw new Exception("ERROR: API credentials not found");
        }

        return $apiKey;
    }

    /**
     * @return string
     */
    protected function buildSearchRequestUrl()
    {
        $url = self::YELP_SEARCH_URL;
        $url .= '?term=lunch';

        if (is_array($this->cuisines)) {
            $url .= '&categories=' . implode(",", $this->cuisines);
        }

        // Geolocation OR Location
        // prioritize geolocation over location
        if (!empty($this->geolocation)) {
            $geolocation = json_decode($this->geolocation, true);
            $url .= "&latitude=".$geolocation['lat'];
            $url .= "&longitude=".$geolocation['lng'];
        } else {
            $url .= "&location=".urlencode($this->location);
        }

        if (!empty($this->radius)) {
            $url .= "&radius=$this->radius";
        }
        if (!empty($this->price)) {
            $url .= "&price=".implode(",", $this->price);
        }

        return $url;
    }

    /**
     * @return string
     */
    protected function buildBusinessRequestUrl()
    {
        $url = self::YELP_BUSINESS_URL . $this->businessId;

        return $url;
    }

    /**
     * Build and echo output from response data
     *
     * @param bool $isBusiness
     * @param array $responseData
     * @return void
     */
    protected function jsonOutput($isBusiness, $responseData)
    {
        if ($isBusiness) {
            echo json_encode($responseData);
            return;
        }

        // parse through the response from Yelp
        // to return only necessary information
        $result = array();
        foreach($responseData['businesses'] as $business)
        {
            $result[] = array(
                'id'    => $business['id'],
                'name'  => $business['name'],
                'url'   => $business['url'],
                'image' => $business['image_url']
            );
        }
        echo json_encode($result);
    }
}
