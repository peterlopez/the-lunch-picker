window.$document = $(document);

window.Yelp = new Yelp();
window.Filters = new Filters();
window.Spinner = new Spinner();
window.Geolocation = new Geolocation();
window.Email = new Email();

$(document).ready(function() {
    addMobileClassToHtml(navigator.userAgent.toLowerCase());
    preventImgDrag();

    Yelp.init();
    Filters.init();
    Geolocation.init();
    Email.init();
});
