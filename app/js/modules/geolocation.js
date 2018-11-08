/**
 *
 * @constructor
 */
function Geolocation()
{
    this.getGeolocationLink = function() {
        return $(".location-content a");
    };
    this.getGeolocationInput = function() {
        return $(".location-content input[name='geolocation']");
    };
    this.getLocationInput = function() {
        return $(".location-content input[name='location']");
    };

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
        var $geolocationLink = this.getGeolocationLink();
        if (this.getGeolocationCookie()) {
            this.locationReset('forget me', this.getGeolocationCookie(), true);
            $geolocationLink.one('click', this.removeGeolocation);
        }
        // Bind event handler to trigger geolocation
        else {
            $geolocationLink.one('click', this.triggerGeolocation);
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
        var $locationInput = this.getLocationInput();

        $locationInput.val(inputValue);

        // Remove input field
        if (inputHidden) {
            $locationInput.hide();
        } else {
            $locationInput.show();
        }

        // Change link to remove geolocation
        var $locationLink = this.getGeolocationLink();
        $locationLink.text(linkText);
    };

    /**
     *
     */
    this.triggerGeolocation = function() {
        // Found cookie
        if (Geolocation.getGeolocationCookie()) {
            console.log("found geolocation cookie");

            // Hide input and set geolocation cookie
            this.locationReset('forget me', geolocation.getGeolocationCookie(), true);
            var $locationLink = Geolocation.getGeolocationLink();
            $locationLink.one('click', geolocation.removeGeolocation);

            // close lightbox if exists
            $.featherlight.current().close();

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

        var $geolocationInput = Geolocation.getGeolocationInput();

        // Set cookie
        var geolocationData = JSON.stringify({'lat': latitude, 'lng': longitude});
        Cookies.set('geolocation', geolocationData);
        $geolocationInput.val(geolocationData);

        // Hide input and set geolocation cookie
        Geolocation.locationReset('forget me', '', true);
        var $locationLink = Geolocation.getGeolocationLink();
        $locationLink.one('click', Geolocation.removeGeolocation);

        // close lightbox if exists
        $.featherlight.current().close();

        // apply filters
        Filters.$filterApplyBtn.trigger('click');
    };

    /**
     * callback for
     * @return {string}
     */
    this.geolocationError = function() {
        return "Unable to retrieve your location";
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
        Geolocation.getGeolocationLink().one('click', Geolocation.triggerGeolocation);

        Filters.showApplyFilterBtn();
    };
}
