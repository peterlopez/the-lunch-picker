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

    /**
     *
     */
    this.makeRequest = function()
    {
        $.ajax({
            type: "GET",
            url: './yelp.php',
            data: $("#filter-form").serialize(),
            success: function(data) {
                $("#spinner").removeClass('loading');

                yelp.updateRestaurants(data);
                yelp.updateCuisines(data);
            },
            error: function(req, status, error) {

                $("#spinner .loading-container p").text("Oops! There was a error. Try again later.");
                $("#spinner .loading-container img").prop('src', 'assets/img/error.svg');
            }
        });
    };

    /**
     *
     */
    this.updateRestaurants = function(data)
    {
        $("#btn-spin").prop('disabled', false);

        var output = '';
        var restaurants = data['businesses'];
        restaurants = shuffle(restaurants);
        for(var i=0; i < restaurants.length; i++) {
            var restaurant = restaurants[i];
            output += "<div class='restaurant'><a href='" + restaurant['url'] + "' target='_blank'>";
            output += "<p class='restaurant-name'>" + restaurant['name'] + "</p>";
            output += "</a></div>";
        }

        $("#spinner").html(output);
    };

    /**
     *
     */
    this.updateCuisines = function(data)
    {

    }
}
