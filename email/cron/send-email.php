<?php
use \SendGrid\Mail\To as To;

//
//
// sends a specific email to subscribers in database
// this script should ideally be run on a cron
//
//

// Load Composer libraries
$ROOT_DIR = dirname(dirname(__FILE__));
require($ROOT_DIR . "/vendor/autoload.php");

$success = true;

echo "Starting..", PHP_EOL, PHP_EOL;
$emailTask = new EmailTask();

if (empty($argv[1])) {
    echo 'Sending TEST email', PHP_EOL, PHP_EOL;
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
    echo "Finished successfully ✓", PHP_EOL;
} else {
    echo "Finished with errors! Ｘ", PHP_EOL;
}



/**
 * Class EmailTask
 */
class EmailTask
{
    /**
     * @var string name of SQLite3 database file
     */
    const DB_FILENAME = 'subscribers.sqlite3';

    /**
     * @var PDO|null
     */
    protected $dbh = null;

    /**
     * @var bool will not send to anyone in database
     */
    public $isTestRun = false;

    /**
     * EmailTask constructor.
     */
    public function __construct()
    {
        $this->getDbConnection();
    }

    /**
     * @throws Exception
     */
    public function run()
    {
        if (empty(getenv('SENDGRID_API_KEY'))) {
            throw new Exception("no SendGrid API key found");
        }

        $recipients = $this->getRecipients();
        if (empty($recipients)) {
            echo "no subscribers found", PHP_EOL, PHP_EOL;
            return;
        }
        if (!$this->isTestRun) {
            echo "Sending emails to " . count($recipients) . " subscribers", PHP_EOL;
        }


        // loop through subscriber rows
        foreach ($recipients as $recipient)
        {
            // Get restaurant based on subscriber preferences
            if ($this->isTestRun) {
                echo 'Searching restaurants with Custom Yelp API Shim..', PHP_EOL;
            }
            $restaurants = $this->findRestaurants($recipient['cuisines'], $recipient['location']);
            if(empty($restaurants)) {
                throw new Exception('could not find restaurant');
            }

            // Pick random one for today
            $randomRestaurant = rand(0, count($restaurants) - 1);
            $randomRestaurant = $restaurants[$randomRestaurant];

            // Lookup more information about the restaurant
            if ($this->isTestRun) {
                echo 'Fetching restaurant details from Custom Yelp API Shim..', PHP_EOL;
            }
            $restaurantDetails = $this->getRestaurantDetails($randomRestaurant);
            if (empty($restaurantDetails)) {
                throw new Exception('could not find restaurant details');
            }

            // Send email
            if ($this->isTestRun) {
                echo 'Sending test email to ', $recipient['email'], PHP_EOL, PHP_EOL;
            }
            $emailResponseCode = $this->sendEmail($recipient['email'], $restaurantDetails);
            if ($emailResponseCode >= 400) {
                throw new Exception('HTTP '.$emailResponseCode.' bad response from SendGrid service');
            }

            // show progress
            if (!$this->isTestRun) {
                echo ".";
            }
        }

        if (!$this->isTestRun) {
            echo PHP_EOL, 'Sent emails to '.count($recipients).' subscribers', PHP_EOL, PHP_EOL;
        }
    }

    /**
     * @return PDO
     * @throws PDOException
     */
    protected function getDbConnection()
    {
        $dsn = 'sqlite:'.dirname(dirname(__FILE__)).'/db/'.$this::DB_FILENAME;
        $this->dbh = new PDO($dsn);

        return $this->dbh;
    }

    /**
     * @return void
     */
    public function closeDbConnection()
    {
        $this->dbh = null;
    }

    /**
     * @return bool|array
     */
    protected function getRecipients()
    {
        if ($this->isTestRun) {
            $recipients = [[
                'email' => 'test@example.com',
                'cuisines' => 'bbq',
                'location' => 'Denver, CO',
            ]];
        }
        else {
            // prepare and execute query
            $query = $this->dbh->prepare("SELECT * FROM subscribers");
            $query->execute();
            $recipients = $query->fetchAll();
            if (empty($recipients)) {
                return false;
            }
        }

        return $recipients;
    }

    /**
     * @param string $cuisines
     * @param string $location
     * @return array
     * @throws Exception
     */
    protected function findRestaurants($cuisines, $location)
    {
        // Build URL with GET params
        $url  = 'http://localhost/yelp.php?';
        $url .= http_build_query(array(
            'cuisines' => $cuisines,
            'location' => $location
        ));
        if ($this->isTestRun) {
            echo $url, PHP_EOL, PHP_EOL;
        }

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        // Make request and get response
        $response = json_decode(curl_exec($ch), true);

        return $response;
    }

    /**
     * @param array $restaurant data about restaurant returned from Yelp API
     * @return array
     */
    protected function getRestaurantDetails($restaurant)
    {
        // Build URL with GET params
        $url  = 'http://localhost/yelp.php?';
        $url .= http_build_query(array(
            'business' => $restaurant['id']
        ));
        if ($this->isTestRun) {
            echo $url, PHP_EOL, PHP_EOL;
        }

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        // Make request and get response
        $response = json_decode(curl_exec($ch), true);

        return $response;

    }

    /**
     * @param $recipient
     * @param $restaurant
     * @return int (\SendGrid\Response $statusCode)
     * @throws \SendGrid\Mail\TypeException
     */
    protected function sendEmail($recipient, $restaurant)
    {
        $email = new \SendGrid\Mail\Mail();

        $restaurant['trimmedName'] = $this->trimTextByWord($restaurant['name'], 4);

        $to = new To(
            $recipient, // address
            $recipient, // name
            [
                'restaurant' => $restaurant,
                'date' => date('n/j')
            ]
        );


        $email->setFrom("dailymail@thelunchpicker.com", "The Lunch Picker");
        $email->addTo($to);

        $email->setTemplateId("d-f46651a0c58047e4a30d9681eb27ce37");

        $sendgrid = new \SendGrid(getenv('SENDGRID_API_KEY'));

        $response = $sendgrid->send($email);

        return $response->statusCode();
    }

    /**
     * @param string $text
     * @param int $limit
     * @return string
     */
    protected function trimTextByWord($text, $limit)
    {
        if (str_word_count($text, 0) > $limit) {
            $words = str_word_count($text, 2);
            $pos = array_keys($words);
            $text = substr($text, 0, $pos[$limit]) . '...';
        }
        return $text;
    }
}
