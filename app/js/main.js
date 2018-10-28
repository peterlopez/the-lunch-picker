window.yelp = new Yelp();

window.geolocation = new Geolocation();
$(document).ready(function() {
    geolocation.init();
});

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
        var $filterApplyBtn = $("#btn-filter-apply");

        $filterApplyBtn.fadeIn();

        if (e.which === 13) { // enter key
            e.preventDefault();
            $("#location.filter").trigger('click');
            $filterApplyBtn.trigger('click');
            $filterApplyBtn.hide();
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

        // Don't set location cookie if using geolocation
        if (geolocation.getGeolocationCookie() === false) {
            Cookies.set('location', location);
        }

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
 * Use cookies to remember cuisines
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
});

/**
 * Hide flyouts when clicking outside of them
 * while they are open
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

// TODO filter out cuisines which don't apply
