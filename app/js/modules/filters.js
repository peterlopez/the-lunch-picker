/**
 *
 * @constructor
 */
function Filters()
{
    // filter buttons on toolbar
    this.$cuisines = $("#cuisines");
    this.$location = $("#location");
    this.$price = $("#price");

    // flyouts
    this.$cuisinesFlyout = $("#cuisines-list");
    this.$locationFlyout = $("#location-content");
    this.$priceFlyout = $("#prices-list");

    this.$allCuisinesCheckbox = $("");
    this.$cuisinesInputs = $("#cuisines input");
    this.$locationInput = $('#location input');
    this.$priceInputs = $('#prices-list input');
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

        // Trigger initial fetch
        Filters.$filterApplyBtn.trigger('click');
    };

    /**
     *
     */
    this.bindEventHandlers = function()
    {
        // Open flyouts
        this.$cuisines.on('click', this.toggleFlyout);
        this.$location.on('click', this.toggleFlyout);
        this.$price.on('click', this.toggleFlyout);

        //  Inputs
        this.$locationInput.on('keypress', this.processLocationInput);
        this.$allCuisinesCheckbox.on('change', this.toggleAllCuisines);
        this.$cuisinesInputs.on('change', this.showApplyFilterBtn);
        this.$priceInputs.on('change', this.showApplyFilterBtn)

        // Hide flyouts after losing focus
        $document.click(function() {
            Filters.$locationFlyout.hide();
            Filters.$cuisinesFlyout.hide();
            Filters.$priceFlyout.hide()
        });
        // Prevent hiding flyouts when clicking on flyouts
        this.$location.on('click', this.stopBubbling);
        this.$locationFlyout.on('click', this.stopBubbling);
        this.$cuisines.on('click', this.stopBubbling);
        this.$cuisinesFlyout.on('click', this.stopBubbling);
        this.$price.on('click', this.stopBubbling);
        this.$priceFlyout.on('click', this.stopBubbling);

        this.$filterApplyBtn.on('click', this.applyFilters);
    };

    this.stopBubbling = function(event) {
        event.stopPropagation();
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

    this.showApplyFilterBtn = function()
    {
        Filters.$filterApplyBtn.fadeIn();
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

    /**
     *
     */
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

    /**
     *
     */
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
