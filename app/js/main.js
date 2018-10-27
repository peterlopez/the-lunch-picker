window.yelp = new Yelp();

var rouletteOptions = {
    speed: 8,
    duration: 2, // in seconds
    stopImageNumber: 0, // set this randomly later

    startCallback : function() {
        console.log('start');
        $("#btn-spin").prop('disabled', true);
    },
    slowDownCallback : function() {
        console.log('slowDown');
    },
    stopCallback : function($stopEl) {
        console.log('stop');
        $($stopEl).addClass('winner');
        $("#btn-spin").prop('disabled', false);
    }
};

/**
 * Filter toggle event handlers
 */
$(document).ready(function() {
    $("#cuisines").click(function() {
        $("#cuisines-list").toggle();
        $(this).toggleClass("flyout-open");
    });
    $('#cuisines-list').on('click', function (event) {
        event.stopPropagation();
    });
    $("#location").click(function() {
        $("#location-content").toggle();
        $(this).toggleClass("flyout-open");
    });
    $('#location-content').on('click', function (event) {
        event.stopPropagation();
    });
});


/**
 * Filter change event handlers
 */
$(document).ready(function() {
    $('#location input').on('keypress', function (e) {
        $("#btn-filter-apply").fadeIn();

        if (e.which === 13) {
            e.preventDefault();
            $("#location.filter").trigger('click');
            $("#btn-filter-apply").trigger('click');
            $("#btn-filter-apply").hide();
        }

        e.stopPropagation();
    });

    $("#cuisines-list input").change(function() {
        $("#btn-filter-apply").fadeIn();
    });
});


/**
 * Apply filters button event handler
 */
$(document).ready(function() {
    $("#btn-filter-apply").click(function() {
        console.log("updating restaurants");

        // Set cookies
        var $selectedCuisines = $("#cuisines-list input:checked");
        var selectedCuisines = [];
        $selectedCuisines.each(function() {
            if ($(this).val() === "all") {
                return;
            }
            selectedCuisines.push($(this).val());
        });
        Cookies.set('cuisines', JSON.stringify(selectedCuisines));
        var location = $("#location-content input").val();
        Cookies.set('location', location);

        // Display loading screen
        var $loadingScreen = $(".loading-container").clone();
        $("#spinner").html($loadingScreen);
        $loadingScreen.fadeIn();
        $(this).fadeOut();

        // Make API request
        $.ajax({
            type: "GET",
            url: './yelp.php',
            data: $("#filter-form").serialize(),
            success: function(data) {
                yelp.updateRestaurants(data);
                yelp.updateCuisines(data);
            }
        });
    });
});


/**
 * Use cookies to remember cuisines and location filters
 */
$(document).ready(function() {
    var cuisinesCookie = Cookies.get('cuisines');
    if (typeof cuisinesCookie !== "undefined") {
        // decode into array
        // iterate array and check each box with that value
        var checkboxes = $("#cuisines-list input");
        checkboxes.each(function() {
            var cuisine = $(this).val();

            if (cuisinesCookie.indexOf(cuisine) !== -1) {
                $(this).prop('checked', true);
            }
            else {
                $(this).prop('checked', false);
            }
        });
    }

    var locationCookie = Cookies.get('location');
    if (typeof locationCookie !== "undefined") {
        $("#location-content input").val(locationCookie)
    }
});

/**
 *
 */
$(document).ready(function() {
    $(document).click(function() {
        $("#location-content").hide();
        $("#cuisines-list").hide();
    });

    $("#location.filter, #cuisines.filter, #location-content, #cuisines-list").on('click', function(e) {
        e.stopPropagation();
    });
});


/**
 * Spin!
 */
$(document).ready(function() {
    $("#btn-spin").click(function() {
        $("#btn-filter-apply").fadeOut();

        var numItems = $(".restaurant").length;
        rouletteOptions.stopImageNumber = Math.floor(Math.random() * numItems) + 1;

        var roulette = $('#spinner');
        roulette.roulette(rouletteOptions);
        roulette.roulette('start');
    });
});

/**
 * Select all cuisines checkbox
 */
$(document).ready(function() {
    $("#all-checkbox").change(function() {
        $(this).prop('checked', !$(this).prop('checked'));

        var $cuisines = $("#cuisines-list input");
        $cuisines.each(function() {
            $(this).prop('checked', !$(this).prop('checked'));
        });
    })
});

/**
 * Trigger initial request
 */
$(document).ready(function() {
    $("#btn-filter-apply").trigger('click');
});


// $(document).ready(function() {
//     var svg = document.getElementById("logo");
//
// // Get the real bounding box of the icon shape
//     var bbox = svg.getBBox();
//
// // Get the viewBox width and height
//     var viewBox_width = svg.viewBox.baseVal.width;
//     var viewBox_height = svg.viewBox.baseVal.height;
//
// // Recenter the contents
//     svg.viewBox.baseVal.x = bbox.x - (viewBox_width - bbox.width) / 2;
//     svg.viewBox.baseVal.y = bbox.y - (viewBox_height - bbox.height) / 2;
// });

/**
 * Fisher-Yates Shuffle
 * @param array
 * @return {*}
 */
function shuffle(array) {
    var counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        var index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}


function geolocationChange() {

}

/**
 *
 * @param linkText
 * @param inputName
 * @param inputValue
 * @param inputHidden
 */
function locationReset(linkText, inputName, inputValue, inputHidden) {
    var $locationInput = $("#location-content input");

    $locationInput.val(inputValue);
    $locationInput.prop('name', inputName);

    // Remove input field
    if (inputHidden) {
        $locationInput.hide();
    } else {
        $locationInput.show();
    }

    // Change link to remove geolocation
    var $locationLink = $("#location-content a");
    $locationLink.text(linkText);
}

/**
 *
 */
$(document).ready(function() {
    if (!navigator.geolocation){
        $(".geolocate").remove();
        return;
    }

    $(".geolocate").click(function() {
        // Found cookie
        var geolocationCookie = Cookies.get('geolocation');
        console.log("geolocationCookie: "+geolocationCookie);
        if (typeof geolocationCookie !== "undefined") {
            console.log("found geolocation cookie");

            // Hide input and set geolocation cookie
            locationReset('forget me', 'geolocation', geolocationCookie, true);
            var $locationLink = $("#location-content a");
            $locationLink.bind('click', removeGeolocation);

            // apply filters
            $("#btn-filter-apply").trigger('click');
            return;
        }

        // Request geolocation
        console.log("fetching geolocation");
        navigator.geolocation.getCurrentPosition(success, error);
        function success(position) {
            console.log("success fetching geolocation");
            var latitude  = position.coords.latitude;
            var longitude = position.coords.longitude;

            var $locationInput = $("#location-content input");

            // Set cookie
            var geolocation = JSON.stringify({'lat': latitude, 'lng': longitude});
            Cookies.set('geolocation', geolocation);
            $locationInput.val(geolocation);

            // Hide input and set geolocation cookie
            locationReset('forget me', 'geolocation', geolocationCookie, true);
            var $locationLink = $("#location-content a");
            $locationLink.bind('click', removeGeolocation);

            // apply filters
            $("#btn-filter-apply").trigger('click');
        }

        function error() {
            return "Unable to retrieve your location";
        }
    });


    function removeGeolocation() {
        // remove cookie
        Cookies.remove('geolocation');

        var locationCookie = Cookies.get('location');
        locationReset('locate me', 'location', locationCookie, false);

        // change back name of input
        var $locationInput = $("#location-content input");
        $locationInput.prop('name', 'location');
        $locationInput.val("");

        // change back link
        var $locationLink = $("#location-content a");
        $locationLink.text("locate me");
        $locationLink.removeClass("remove-geolocate");
        $locationLink.addClass("geolocate");

    }
});


// Auto fetch location

// Filter out cuisines which don't apply
