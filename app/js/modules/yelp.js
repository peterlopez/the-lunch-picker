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
     * Trigger AJAX call to API given current form data
     */
    this.makeRequest = function()
    {
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
        if (isNull) {
            // normally this function is callback from AJAX
            // hence, passing in all the nulls
            Yelp.errorCallback(null, null, null, data);
            return;
        }

        var dataIsInvalid = typeof data !== 'object';
        if (dataIsInvalid) {
            Yelp.errorCallback(null, null, null, data);
            return;
        }

        var dataIsEmpty = data.length === 0;
        if (dataIsEmpty) {
            Yelp.emptyCallback();
            return;
        }

        // update spinner
        Spinner.update(data);
        Spinner.$spinner.removeClass('loading');
    };

    /**
     * Display message to user that there are no
     * restaurants found given the query parameters
     */
    this.emptyCallback = function()
    {
        $("#spinner .loading-container p").text("Sorry, no restaurants found in this area");
        $("#spinner .loading-container img").prop('src', ''); //assets/img/error.svg
    };

    /**
     *
     * Display message to user that there was an
     * issue with the server response
     *
     * @param {jqXHR} jqXHR
     * @param {String} textStatus
     * @param {String} errorThrown
     * @param {Object} invalidResponseData - custom parameter added for when
     *                                       request is successful but response data is invalid
     *
     * @callback from AJAX request to yelp.php
     *
     */
    this.errorCallback = function(jqXHR, textStatus, errorThrown, invalidResponseData)
    {
        if (typeof invalidResponseData !== "undefined" && invalidResponseData !== null) {
            console.log("Yelp data is null or invalid");
            console.log(invalidResponseData);
        }

        $("#spinner .loading-container p").text("Oops! There was a error.");
        $("#spinner .loading-container img").prop('src', 'assets/img/error.svg');

        sendGaEvent('Spinner', 'error', null, {nonInteraction: true});
    };
}
