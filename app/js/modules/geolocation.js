/**
 *
 * @constructor
 */
function Geolocation()
{
    this.$geolocationLink = $(".location-content a");
    this.$geolocationInput = $(".location-content input[name='geolocation']");
    this.$locationInput = $(".location-content input[name='location']");

    /**
     *
     * @return {string|boolean}
     */
    this.getGeolocationCookie = function() {
        var geolocationCookie = Cookies.get('geolocation');
        if (typeof geolocationCookie !== "undefined" && geolocationCookie != null) {
            return geolocationCookie;
        }
        return false;
    };

    /**
     *
     * @return {string|boolean}
     */
    this.getLocationCookie = function() {
        var locationCookie = Cookies.get('location');
        if (typeof locationCookie !== "undefined" && locationCookie != null) {
            return locationCookie;
        }
        return false;
    };

    /**
     *
     */
    this.init = function()
    {
        if (!navigator.geolocation){
            $(".geolocate").remove();
            return;
        }

        // Change link to remove geolocation
        if (this.getGeolocationCookie()) {
            this.locationReset('forget me', this.getGeolocationCookie(), true);
            this.$geolocationLink.one('click', this.removeGeolocation);
        }
        // Bind event handler to trigger geolocation
        else {
            this.$geolocationLink.one('click', this.triggerGeolocation);
        }
    };


    /**
     *
     * @param linkText
     * @param inputName
     * @param inputValue
     * @param inputHidden
     */
    this.locationReset = function(linkText, inputValue, inputHidden)
    {
        var $locationInput = this.$locationInput;

        $locationInput.val(inputValue);

        // Remove input field
        if (inputHidden) {
            $locationInput.hide();
        } else {
            $locationInput.show();
        }

        // Change link to remove geolocation
        var $locationLink = this.$geolocationLink;
        $locationLink.text(linkText);
    };

    /**
     * @param {event} event
     */
    this.triggerGeolocation = function(event) {
        // hide link and input to display loading screen
        Filters.$locationFlyout.find('a').hide();
        Filters.$locationFlyout.find('input').hide();
        Filters.$locationFlyout.find('.loading-spinner').show();

        // Found cookie
        if (Geolocation.getGeolocationCookie()) {
            console.log("found geolocation cookie");

            // Hide input and set geolocation cookie
            this.locationReset('forget me', geolocation.getGeolocationCookie(), true);
            var $locationLink = Geolocation.$geolocationLink;
            $locationLink.one('click', geolocation.removeGeolocation);

            // close lightbox if exists
            if ($.featherlight.current() !== null) {
                $.featherlight.current().close();
            }

            // apply filters
            $("#btn-filter-apply").trigger('click');
            return;
        }

        // Request geolocation
        navigator.geolocation.getCurrentPosition(Geolocation.geolocationSuccess, Geolocation.geolocationError);
    };

    /**
     *
     * @param position
     */
    this.geolocationSuccess = function(position) {
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;

        var $geolocationInput = Geolocation.$geolocationInput;

        // Set cookie
        var geolocationData = JSON.stringify({'lat': latitude, 'lng': longitude});
        Cookies.set('geolocation', geolocationData);
        $geolocationInput.val(geolocationData);

        // Hide input and loading
        Geolocation.locationReset('forget me', '', true);
        Filters.$locationFlyout.find('a').show();
        Filters.$locationFlyout.find('.loading-spinner').hide();

        // rebind event handler for geolocation link
        var $locationLink = Geolocation.$geolocationLink;
        $locationLink.one('click', Geolocation.removeGeolocation);

        // close lightbox if exists
        if ($.featherlight.current() !== null) {
            $.featherlight.current().close();
        }

        // apply filters
        Filters.$filterApplyBtn.trigger('click');
    };

    /**
     * callback for
     * @return {string}
     */
    this.geolocationError = function() {
        // hide loading and show error message
        Filters.$locationFlyout.find('.loading-spinner').hide();
        Filters.$locationFlyout.find('.geolocation-error').show();

        Geolocation.$locationInput.show();
    };


    /**
     * @param {event} event
     */
    this.removeGeolocation = function(event) {
        Cookies.remove('geolocation');

        // get (non-geo) location value from cookie if available
        var locationValue = Geolocation.getLocationCookie();
        locationValue = locationValue === false ? '' : locationValue;

        // reset link and location input
        Geolocation.locationReset('locate me', locationValue, false);

        // rebind event handler for geolocation link
        Geolocation.$geolocationLink.one('click', Geolocation.triggerGeolocation);

        Filters.showApplyFilterBtn();
    };
}
