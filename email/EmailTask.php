<?php
use \SendGrid\Mail\To as To;

// Load Composer libraries
$ROOT_DIR = dirname(__FILE__);
require($ROOT_DIR . "/vendor/autoload.php");


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
     * @var string email 'from'
     */
    const FROM_ADDRESS = "mail@thelunchpicker.com";

    /**
     * @var string email 'from'
     */
    const FROM_NAME = "The Lunch Picker";

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
            $restaurantDetails['trimmedName'] = $this->trimTextByWord($restaurantDetails['name'], 4);

            // Lookup unsubscribe token
            $unsubscribeToken = $this->getUnsubscribeToken($recipient['email']);

            // Assemble template variables
            $templateVars = [
                'restaurant' => $restaurantDetails,
                'date' => date('n/j'),
                'unsubscribeToken' => $unsubscribeToken
            ];

            // Send email
            if ($this->isTestRun) {
                echo 'Sending test email to ', $recipient['email'], PHP_EOL;
                echo 'with template variables:', print_r($templateVars, 1), PHP_EOL, PHP_EOL;
            }
            $emailResponseCode = $this->sendEmail($recipient['email'], $templateVars);
            if ($emailResponseCode >= 400) {
                throw new Exception('HTTP '.$emailResponseCode.' bad response from SendGrid service');
            }

            // Update last sent date
            if (!$this->isTestRun) {
                $this->updateLastSent($recipient);

                echo "."; // show progress
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
        $dsn = 'sqlite:'.dirname(__FILE__).'/db/'.$this::DB_FILENAME;
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
            $query  = "SELECT * FROM subscribers ";
            $query .= "WHERE active=1 AND last_sent <= datetime('now','-1 day')";

            // prepare and execute query
            $stmt = $this->dbh->prepare($query);
            $stmt->execute();
            $recipients = $stmt->fetchAll();
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
     * @param $templateVars
     * @return int (\SendGrid\Response $statusCode)
     * @throws \SendGrid\Mail\TypeException
     */
    protected function sendEmail($recipient, $templateVars)
    {
        $email = new \SendGrid\Mail\Mail();

        $to = new To(
            $recipient, // address
            $recipient, // name
            $templateVars // template variables
        );

        $email->setFrom($this::FROM_ADDRESS, $this::FROM_NAME);
        $email->addTo($to);

        $email->setTemplateId(SENDGRID_EMAIL_TEMPLATE_ID);

        $sendgrid = new \SendGrid(getenv('SENDGRID_API_KEY'));

        $response = $sendgrid->send($email);

        return $response->statusCode();
    }

    /**
     * @param $recipient
     * @return void
     */
    protected function updateLastSent($recipient)
    {
        $query  = "UPDATE subscribers ";
        $query .= "SET last_sent = datetime('now') ";
        $query .= "WHERE email='".$recipient['email']."' ";

        // prepare and execute query
        $stmt = $this->dbh->prepare($query);
        $stmt->execute();
        return;
    }

    /**
     * @param string $text
     * @param int $limit
     * @return string
     */
    public function trimTextByWord($text, $limit)
    {
        if (str_word_count($text, 0) > $limit) {
            $words = str_word_count($text, 2);
            $pos = array_keys($words);
            $text = substr($text, 0, $pos[$limit]) . '...';
        }
        return $text;
    }

    /**
     * Create obfuscated hash
     *
     * @param string $email
     * @return string
     */
    public function generateUnsubscribeToken($email)
    {
        $tokenString  = $email;
        $tokenString .= date('c');
        $tokenString .= rand(rand(0, 9999), 999999);

        return hash('sha256', $tokenString);
    }

    /**
     * @param $email
     * @return string
     * @throws Exception
     */
    protected function getUnsubscribeToken($email)
    {
        $query  = "SELECT unsubscribe_token FROM subscribers ";
        $query .= "WHERE email=?";

        // prepare and execute query
        $stmt = $this->dbh->prepare($query);
        $stmt->execute([$email]);

        $token = $stmt->fetchColumn();
        if (!$token) {
            throw new Exception('no unsubcribe token found for email: '.$email);
        }

        return $token;
    }

    /**
     * @param string $email
     * @param string $token
     * @return bool
     */
    public function validateUnsubscribeToken($email, $token)
    {
        $query  = "SELECT COUNT(*) FROM subscribers ";
        $query .= "WHERE email=? AND unsubscribe_token=?";

        // prepare and execute query
        $stmt = $this->dbh->prepare($query);
        $stmt->execute([$email, $token]);

        $rows = $stmt->fetchColumn();

        return $rows == 1;
    }

    /**
     * @param $email
     * @throws PDOException
     */
    public function unsubscribe($email)
    {
        $query  = "UPDATE subscribers ";
        $query .= "SET active=0 ";
        $query .= "WHERE email=? ";

        // prepare and execute query
        $stmt = $this->dbh->prepare($query);
        $stmt->execute([$email]);
    }
}
