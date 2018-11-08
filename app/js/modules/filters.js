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
    this.$cuisinesFlyout = $(".cuisines-list");
    this.$locationFlyout = $(".location-content");
    this.$priceFlyout = $(".prices-list");

    this.$allCuisinesCheckbox = $("#all-checkbox");
    this.$cuisinesInputs = $(".cuisines-list input");
    this.$locationInput = $(".location-content input[name='location']");
    this.$geolocationInput = $(".location-content input[name='geolocation']");
    this.$priceInputs = $('.prices-list input');
    this.$filterApplyBtn = $("#btn-filter-apply");

    // Cookies
    this.cuisinesCookie = '';
    this.locationCookie = '';
    this.geolocationCookie = '';

    /**
     * jQuery featherlight plugin
     */
    this.featherlightConfig = {
        namespace:      'featherlight',        /* Name of the events and css class prefix */
        targetAttr:     'data-featherlight',   /* Attribute of the triggered element that contains the selector to the lightbox content */
        variant:        null,                  /* Class that will be added to change look of the lightbox */
        resetCss:       false,                 /* Reset all css */
        background:     null,                  /* Custom DOM for the background, wrapper and the closebutton */
        openTrigger:    'click',               /* Event that triggers the lightbox */
        closeTrigger:   'click',               /* Event that triggers the closing of the lightbox */
        filter:         null,                  /* Selector to filter events. Think $(...).on('click', filter, eventHandler) */
        root:           'body',                /* A selector specifying where to append featherlights */
        openSpeed:      250,                   /* Duration of opening animation */
        closeSpeed:     250,                   /* Duration of closing animation */
        closeOnClick:   'background',          /* Close lightbox on click ('background', 'anywhere', or false) */
        closeOnEsc:     true,                  /* Close lightbox when pressing esc */
        closeIcon:      '&#10005;',            /* Close icon */
        loading:        '',                    /* Content to show while initial content is loading */
        persist:        false,                 /* If set, the content will persist and will be shown again when opened again. 'shared' is a special value when binding multiple elements for them to share the same content */
        otherClose:     null,                  /* Selector for alternate close buttons (e.g. "a.close") */
        beforeOpen:     $.noop,                /* Called before open. can return false to prevent opening of lightbox. Gets event as parameter, this contains all data */
        beforeContent:  $.noop,                /* Called when content is about to be presented. `this` is the featherlight instance. Gets event as parameter */
        beforeClose:    $.noop,                /* Called before close. can return false to prevent opening of lightbox. `this` is the featherlight instance. Gets event as parameter  */
        afterOpen:      $.noop,                /* Called after open. `this` is the featherlight instance. Gets event as parameter  */
        afterContent:   $.noop,                /* Called after content is ready and has been set. Gets event as parameter, this contains all data */
        afterClose:     $.noop,                /* Called after close. `this` is the featherlight instance. Gets event as parameter  */
        onKeyUp:        $.noop,                /* Called on key up for the frontmost featherlight */
        onResize:       $.noop,                /* Called after new content and when a window is resized */
        type:           null,                  /* Specify content type. If unset, it will check for the targetAttrs value. */
        contentFilters: ['jquery', 'image', 'html', 'ajax', 'text'] /* List of content filters to use to determine the content */
    };

    /**
     * @callback document.ready
     */
    this.init = function()
    {
        this.cuisinesCookie = (typeof Cookies.get('cuisines') !== "undefined") ? Cookies.get('cuisines') : '';
        this.locationCookie = (typeof Cookies.get('location') !== "undefined") ? Cookies.get('location') : '';
        this.geolocationCookie = (typeof Cookies.get('geolocation') !== "undefined") ? Cookies.get('geolocation') : '';

        this.setCuisinesBasedOnCookie();
        this.setLocationInputsBasedOnCookie();

        this.bindEventHandlers();

        // Trigger initial fetch
        Filters.$filterApplyBtn.trigger('click');
    };

    /**
     *
     */
    this.bindEventHandlers = function()
    {
        var isMobile = $("html").hasClass('mobile');
        if (isMobile) {
            this.$cuisines.on('click', this.toggleFilterModal);
            this.$location.on('click', this.toggleFilterModal);
            this.$price.on('click', this.toggleFilterModal);
        }
        // Open flyouts - only for desktop
        else {
            this.$cuisines.on('click', this.toggleFlyout);
            this.$location.on('click', this.toggleFlyout);
            this.$price.on('click', this.toggleFlyout);
        }

        //  Inputs
        this.$locationInput.on('keypress', this.processLocationInput);
        this.$allCuisinesCheckbox.on('change', this.toggleAllCuisines);
        this.$cuisinesInputs.on('change', this.showApplyFilterBtn);
        this.$priceInputs.on('change', this.showApplyFilterBtn);

        // Hide flyouts after losing focus
        $document.click(function() {
            Filters.$locationFlyout.hide();
            Filters.$cuisinesFlyout.hide();
            Filters.$priceFlyout.hide();
            Filters.$location.removeClass('flyout-open');
            Filters.$cuisines.removeClass('flyout-open');
            Filters.$price.removeClass('flyout-open');
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
     * @returns {string} JSON encoded array of selected cuisines
     */
    this.getSelectedCuisines = function()
    {
        var $selectedCuisines = $(".cuisines-list input:checked");
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

        // the animations are a bit startling all at once
        setTimeout(function() {
            Spinner.$spinBtn.prop('disabled', true);
        }, 200);
    };

    /**
     * @param {event} event
     */
    this.applyFilters = function(event)
    {
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
        Spinner.$spinBtn.prop('disabled', true);

        // Reset spin button
        Spinner.$spinBtn.text('spin!');

        // Display loading screen
        Filters.$filterApplyBtn.fadeOut();
        Spinner.displayLoadingScreen();

        // Make API request
        Yelp.makeRequest();
    };

    /**
     * @param {event} event
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
     * @param {event} event
     */
    this.toggleFilterModal = function(event)
    {
        // determine which filter was clicked
        var $filter = $(event.target).closest('.filter');

        // create modal
        var $flyout = $filter.find('.flyout');
        Filters.featherlightConfig.beforeClose = Filters.applyFiltersFromModal;
        $.featherlight($flyout, Filters.featherlightConfig);

        Geolocation.init();

        // rebind event handlers
        Filters.$locationInput.on('keypress', this.processLocationInput);
        Filters.$allCuisinesCheckbox.on('change', this.toggleAllCuisines);
        Filters.$cuisinesInputs.on('change', this.showApplyFilterBtn);
        Filters.$priceInputs.on('change', this.showApplyFilterBtn);
    };

    /**
     * @callback beforeClose
     * @param {event} event
     */
    this.applyFiltersFromModal = function(event)
    {
        var $content = this.$content[0];
        var $dest = $(this.target);
        setTimeout(function () {
            $dest.replaceWith($content);
        }, 200);
    };

    /**
     * @param {event} event
     */
    this.toggleFlyout = function(event)
    {
        // determine which filter was clicked
        var $filter = $(event.target).closest('.filter');
        $filter.toggleClass("flyout-open");
    };

    /**
     * Toggles cuisines filters based on
     * pre-existing cookie
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
     * Toggles location inputs based on
     * pre-existing cookie
     */
    this.setLocationInputsBasedOnCookie = function()
    {
        Filters.$locationInput.val(this.locationCookie);
        Filters.$geolocationInput.val(this.geolocationCookie);
    };

    /**
     * @param {event} event
     */
    this.toggleAllCuisines = function(event)
    {
        event.preventDefault();

        var $checkbox = Filters.$allCuisinesCheckbox;
        // current state has already changed after click
        var newState = $checkbox.prop('checked');
        $checkbox.prop('checked', newState);

        var $cuisines = $(".cuisines-list input");
        $cuisines.each(function() {
            $(this).prop('checked', newState);
        });
    };
}
