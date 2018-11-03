/**
 *
 * @constructor
 */
function Yelp()
{
    this.cuisines = {
        'restaurants': 'All',
        'american': 'American',
        'bbq': 'BBQ',
        'pizza': 'Pizza',
        'delis': 'Delis',
        'indian': 'Indian',
        'hotdogs': 'Fast Food',
        "japanese": 'Japanese',
        "italian": 'Italian',
        "mediterranean": 'Mediterranean',
        "mexican": 'Mexican',
        "vegan": 'Vegan'
    };

    this.init = function()
    {
        // nothing to do
    };

    /**
     *
     */
    this.makeRequest = function()
    {
        Spinner.displayLoadingScreen();

        $.ajax({
            type: "GET",
            url: './yelp.php',
            data: $("#filter-form").serialize(),
            success: Yelp.successCallback,
            error: Yelp.errorCallback
        });
    };

    /**
     * @callback from AJAX request to yelp.php
     */
    this.successCallback = function(data)
    {
        // validate data
        var isNull = (data === null);
        var dataIsInvalid = (typeof data !== 'object' && data.businesses === null);
        if (isNull || dataIsInvalid) {
            Yelp.errorCallback();
            return;
        }

        // update spinner
        Spinner.$spinner.removeClass('loading');
        Spinner.update(data);
    };

    /**
     * @callback from AJAX request to yelp.php
     */
    this.errorCallback = function()
    {
        $("#spinner .loading-container p").text("Oops! There was a error.");
        $("#spinner .loading-container img").prop('src', 'assets/img/error.svg');
    };
}
