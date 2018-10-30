/**
 *
 * @constructor
 */
function Filters()
{
    // filter buttons on toolbar
    this.$cuisines = $("#cuisines");
    this.$location = $("#location");

    // flyouts
    this.$cuisinesFlyout = $("#cuisines-list");
    this.$locationFlyout = $("#location-content");

    this.$allCuisinesCheckbox = $("");
    this.$cuisinesInputs = $("#cuisines input");
    //
    this.$locationInput = $('#location input');
    //
    this.$filterApplyBtn = $("#btn-filter-apply");

    // Cookies
    this.cuisinesCookie = '';
    this.locationCookie = '';
    this.geolocationCookie = '';

    this.init = function()
    {
        this.cuisinesCookie = Cookies.get('cuisines') ? Cookies.get('cuisines') : '';
        this.locationCookie = Cookies.get('location') ? Cookies.get('location') : '';
        this.geolocationCookie = Cookies.get('geolocation') ? Cookies.get('geolocation') : '';

        this.setCuisinesBasedOnCookie();
        this.setLocationBasedOnCookie();

        this.bindEventHandlers();
    };

    /**
     *
     */
    this.bindEventHandlers = function()
    {
        // Open flyouts
        this.$cuisines.on('click', this.toggleFlyout);
        this.$location.on('click', this.toggleFlyout);

        //  Inputs
        this.$locationInput.on('keypress', this.processLocationInput);
        this.$allCuisinesCheckbox.on('change', this.toggleAllCuisines);
        this.$cuisinesInputs.on('change', function() {
            Filters.$filterApplyBtn.fadeIn();
        });

        // Hide flyouts after losing focus
        $document.click(function() {
            Filters.$locationFlyout.hide();
            Filters.$cuisinesFlyout.hide();
        });
        $("#location.filter, #cuisines.filter, #location-content, #cuisines-list").on('click', function(e) {
            e.stopPropagation();
        });

        this.$filterApplyBtn.on('click', this.applyFilters);
    };

    /**
     *
     * @returns {string}
     */
    this.getSelectedCuisines = function()
    {
        var $selectedCuisines = $("#cuisines-list input:checked");
        var selectedCuisines = [];
        $selectedCuisines.each(function() {
            if ($(this).val() === "all") {
                return;
            }
            selectedCuisines.push($(this).val());
        });

        return JSON.stringify(selectedCuisines);
    };

    /**
     *
     * @listens applyfiltersbtn:click
     */
    this.applyFilters = function(event)
    {
        console.log("updating restaurants");

        // Set cookies
        // cuisines
        var cuisines = Filters.getSelectedCuisines();
        Cookies.set('cuisines', cuisines);

        // location
        // * geolocation also gets put into location input
        // * only set location cookie if not using geolocation
        var location = Filters.$locationInput.val();
        if (Geolocation.getGeolocationCookie() === false) {
            Cookies.set('location', location);
        }

        // disable spin button while loading
        $spinBtn.prop('disabled', true);

        // Display loading screen
        Spinner.displayLoadingScreen();
        Filters.$filterApplyBtn.fadeOut();

        // Make API request
        Yelp.makeRequest();
    };

    /**
     *
     */
    this.processLocationInput = function(event)
    {
        // fade in for any keypress
        Filters.$filterApplyBtn.fadeIn();

        // "submit" after enter key
        if (event.which === 13) {
            event.preventDefault();
            this.$location.trigger('click');
            this.$filterApplyBtn.trigger('click');
            this.$filterApplyBtn.fadeOut('fast');
        }

        event.stopPropagation();
    };


    /**
     * @listens filters:click
     */
    this.toggleFlyout = function(event)
    {
        // determine which filter was clicked
        console.log(event);

        var $filter = $(event.target).closest('.filter');
        var $flyout = $filter.find('.flyout');

        $flyout.toggle();
        $filter.toggleClass("flyout-open");
    };

    this.setCuisinesBasedOnCookie = function()
    {
        // decode into array
        // iterate array and check each box with that value
        Filters.$cuisinesInputs.each(function() {
            var $this = $(this);
            var cuisine = $this.val();

            if (Filters.cuisinesCookie.indexOf(cuisine) !== -1) {
                $this.prop('checked', true);
            }
            else {
                $this.prop('checked', false);
            }
        });
    };
    this.setLocationBasedOnCookie = function()
    {
        Filters.$locationInput.text(this.locationCookie);
    };

    /**
     *
     */
    this.toggleAllCuisines = function(event)
    {
        var $checkbox = filters.$allCuisinesCheckbox;
        $checkbox.prop('checked', !$checkbox.prop('checked'));

        var $cuisines = $("#cuisines-list input");
        $cuisines.each(function() {
            $(this).prop('checked', !$(this).prop('checked'));
        });
    };
}




// /**
//  * Filter toggle event handlers
//  */
// $(document).ready(function() {
//     $("#cuisines").click(function() {
//         $("#cuisines-list").toggle();
//         $(this).toggleClass("flyout-open");
//     });
//     $('#cuisines-list').on('click', function (event) {
//         event.stopPropagation();
//     });
//     $("#location").click(function() {
//         $("#location-content").toggle();
//         $(this).toggleClass("flyout-open");
//     });
//     $('#location-content').on('click', function (event) {
//         event.stopPropagation();
//     });
// });
//
//
// /**
//  * Filter change event handlers
//  */
// $(document).ready(function() {
//     $('#location input').on('keypress', function (e) {
//         var $filterApplyBtn = $("#btn-filter-apply");
//
//         $filterApplyBtn.fadeIn();
//
//         if (e.which === 13) { // enter key
//             e.preventDefault();
//             $("#location.filter").trigger('click');
//             $filterApplyBtn.trigger('click');
//             $filterApplyBtn.hide();
//         }
//
//         e.stopPropagation();
//     });
//
//     $("#cuisines-list input").change(function() {
//         $("#btn-filter-apply").fadeIn();
//     });
// });
//
// /**
//  * Apply filters button event handler
//  */
// $(document).ready(function() {
//     $("#btn-filter-apply").click(function() {
//         console.log("updating restaurants");
//
//         // Set cookies
//         var $selectedCuisines = $("#cuisines-list input:checked");
//         var selectedCuisines = [];
//         $selectedCuisines.each(function() {
//             if ($(this).val() === "all") {
//                 return;
//             }
//             selectedCuisines.push($(this).val());
//         });
//         Cookies.set('cuisines', JSON.stringify(selectedCuisines));
//         var location = $("#location-content input").val();
//
//         // Don't set location cookie if using geolocation
//         if (geolocation.getGeolocationCookie() === false) {
//             Cookies.set('location', location);
//         }
//
//         // disable spin button while loading
//         $("#btn-spin").prop('disabled', true);
//
//         // Display loading screen
//         $("#spinner").addClass("loading");
//         var $loadingScreen = $(".loading-container").clone();
//         $("#spinner").html($loadingScreen);
//         $loadingScreen.fadeIn();
//         $(this).fadeOut();
//
//         // Make API request
//         yelp.makeRequest();
//     });
// });
//
// /**
//  * Use cookies to remember cuisines
//  */
// $(document).ready(function() {
//     var cuisinesCookie = Cookies.get('cuisines');
//     if (typeof cuisinesCookie !== "undefined") {
//         // decode into array
//         // iterate array and check each box with that value
//         var checkboxes = $("#cuisines-list input");
//         checkboxes.each(function() {
//             var cuisine = $(this).val();
//
//             if (cuisinesCookie.indexOf(cuisine) !== -1) {
//                 $(this).prop('checked', true);
//             }
//             else {
//                 $(this).prop('checked', false);
//             }
//         });
//     }
// });
//
//
// /**
//  * Hide flyouts when clicking outside of them
//  * while they are open
//  */
// $(document).ready(function() {
//     $(document).click(function() {
//         $("#location-content").hide();
//         $("#cuisines-list").hide();
//     });
//
//     $("#location.filter, #cuisines.filter, #location-content, #cuisines-list").on('click', function(e) {
//         e.stopPropagation();
//     });
// });
//
// /**
//  * Select all cuisines checkbox
//  */
// $(document).ready(function() {
//     $("#all-checkbox").change(function() {
//         $(this).prop('checked', !$(this).prop('checked'));
//
//         var $cuisines = $("#cuisines-list input");
//         $cuisines.each(function() {
//             $(this).prop('checked', !$(this).prop('checked'));
//         });
//     })
// });
