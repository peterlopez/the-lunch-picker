window.$document = $(document);

window.Yelp = new Yelp();
window.Filters = new Filters();
window.Spinner = new Spinner();
window.Geolocation = new Geolocation();

$(document).ready(function() {
    addMobileClassToHtml(navigator.userAgent.toLowerCase());

    Yelp.init();
    Filters.init();
    Geolocation.init();
});
