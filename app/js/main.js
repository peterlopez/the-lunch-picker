window.$document = $(document);

window.Yelp = new Yelp();
window.Filters = new Filters();
window.Spinner = new Spinner();
window.Geolocation = new Geolocation();

$(document).ready(function() {
    Yelp.init();
    Filters.init();
    Spinner.init();
    Geolocation.init();
});
