/**
 *
 * @constructor
 */
function Geolocation()
{
    /**
     * helper method to prevent accessing undefined or null cookies
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
     * helper method to prevent accessing undefined or null cookies
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
     * @callback document.ready
     */
    this.init = function()
    {
        if (!navigator.geolocation){
            Filters.$geolocationLink().remove();
            return;
        }

        // Bind event handler to remove geolocation
        if (this.getGeolocationCookie()) {
            // Change link to remove geolocation
            this.locationReset('forget me', this.getGeolocationCookie(), true);
            Filters.$geolocationLink().one('click', this.removeGeolocation);
        }
        // Bind event handler to trigger geolocation
        else {
            Filters.$geolocationLink().one('click', this.triggerGeolocation);
        }
    };


    /**
     *
     * @param linkText
     * @param inputValue
     * @param inputHidden
     */
    this.locationReset = function(linkText, inputValue, inputHidden)
    {
        var $locationInput = Filters.$locationInput();

        $locationInput.val(inputValue);

        // Remove input field
        if (inputHidden) {
            $locationInput.hide();
        } else {
            $locationInput.show();
        }

        // Change link to remove geolocation
        var $locationLink = Filters.$geolocationLink();
        $locationLink.text(linkText);
    };

    /**
     * @callback geolocationLink
     * @param {event} event
     */
    this.triggerGeolocation = function(event) {
        // hide link and input to display loading screen
        Filters.$geolocationLink().hide();
        Filters.$locationInput().hide();
        Filters.$geolocationLoading().show();

        // Found cookie
        if (Geolocation.getGeolocationCookie()) {

            // Hide input and set geolocation cookie
            this.locationReset('forget me', geolocation.getGeolocationCookie(), true);
            var $locationLink = Filters.$geolocationLink();
            $locationLink.one('click', geolocation.removeGeolocation);

            // close lightbox if exists
            if ($.featherlight.current() !== null) {
                $.featherlight.current().close();
            }

            // apply filters
            Filters.$filterApplyBtn.trigger('click');
            return;
        }

        // Request geolocation
        navigator.geolocation.getCurrentPosition(Geolocation.geolocationSuccess, Geolocation.geolocationError);

        sendGaEvent('Geolocation', 'fired');
    };

    /**
     *
     * @param position
     */
    this.geolocationSuccess = function(position) {
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;

        var $geolocationInput = Filters.$geolocationInput();

        // Set cookie
        var geolocationData = JSON.stringify({'lat': latitude, 'lng': longitude});
        Cookies.set('geolocation', geolocationData);
        $geolocationInput.val(geolocationData);

        // Hide input and loading
        Geolocation.locationReset('forget me', '', true);
        Filters.$geolocationLink().show();
        Filters.$geolocationLoading().hide();

        // rebind event handler for geolocation link
        var $locationLink = Filters.$geolocationLink();
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

        Geolocation.$locationInput().show();
    };


    /**
     * @param {event} event
     */
    this.removeGeolocation = function(event) {
        Cookies.remove('geolocation');

        // get (non-geo) location value from cookie if available
        var locationValue = Geolocation.getLocationCookie();
        locationValue = locationValue === false ? '' : locationValue;

        // reset link and location inputs
        Geolocation.locationReset('locate me', locationValue, false);
        Filters.$geolocationInput().val("");

        // rebind event handler for geolocation link
        Filters.$geolocationLink().one('click', Geolocation.triggerGeolocation);

        Filters.showApplyFilterBtn();
    };
}
