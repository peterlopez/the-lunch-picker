/**
 *
 * @constructor
 */
function Geolocation()
{
    this.getGeolocationLink = function() {
        return $("#location.filter a");
    };
    this.getLocationInput = function() {
        return $("#location.filter input");
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
        if (geolocation.getGeolocationCookie()) {
            console.log("found geolocation cookie");

            // Hide input and set geolocation cookie
            this.locationReset('forget me', geolocation.getGeolocationCookie(), true);
            var $locationLink = geolocation.getGeolocationLink();
            $locationLink.one('click', geolocation.removeGeolocation);

            // apply filters
            $("#btn-filter-apply").trigger('click');
            return;
        }

        // Request geolocation
        navigator.geolocation.getCurrentPosition(geolocation.geolocationSuccess, geolocation.geolocationError);
    };

    /**
     *
     * @param position
     */
    this.geolocationSuccess = function(position) {
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;

        var $locationInput = geolocation.getLocationInput();

        // Set cookie
        var geolocationData = JSON.stringify({'lat': latitude, 'lng': longitude});
        Cookies.set('geolocation', geolocationData);
        $locationInput.val(geolocationData);

        // Hide input and set geolocation cookie
        geolocation.locationReset('forget me', geolocationData, true);
        var $locationLink = geolocation.getGeolocationLink();
        $locationLink.one('click', geolocation.removeGeolocation);

        // apply filters
        $("#btn-filter-apply").trigger('click');
    };

    /**
     * callback for
     * @return {string}
     */
    this.geolocationError = function() {
        return "Unable to retrieve your location";
    };


    /**
     *
     */
    this.removeGeolocation = function() {
        console.log("removing geolocation");

        Cookies.remove('geolocation');

        var locationValue = geolocation.getLocationCookie();
        locationValue = locationValue === false ? '' : locationValue;

        geolocation.locationReset('locate me', locationValue, false);

        geolocation.getGeolocationLink().one('click', geolocation.triggerGeolocation);
    };
}
