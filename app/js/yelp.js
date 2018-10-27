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
    this.updateRestaurants = function(data)
    {
        console.log(data);

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
