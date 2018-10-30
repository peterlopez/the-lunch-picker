window.$document = $(document);
window.$spinBtn = $("#btn-spin");

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

/**
 * Trigger initial request
 */
$(document).ready(function() {
    $("#btn-filter-apply").trigger('click');
});

/**
 * Fisher-Yates Shuffle
 * @param array
 * @return {*}
 */
function shuffle(array) {
    var counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        var index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}
