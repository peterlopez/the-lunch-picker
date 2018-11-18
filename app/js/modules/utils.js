window.shuffle = shuffle;

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

/**
 * @param deviceAgent navigator.userAgent
 */
function addMobileClassToHtml(deviceAgent) {
    var $html = $("html");

    if (deviceAgent.match(/(iphone|ipod|ipad)/)) {
        $html.addClass('ios');
        $html.addClass('mobile');
    }
    if (deviceAgent.match(/android/)) {
        $html.addClass('android');
        $html.addClass('mobile');
    }

    if (deviceAgent.match(/blackberry/)) {
        $html.addClass('blackberry');
        $html.addClass('mobile');
    }

    if (deviceAgent.match(/(symbianos|^sonyericsson|^nokia|^samsung|^lg)/)) {
        $html.addClass('mobile');
    }
}

function preventImgDrag() {
    $('img').on('dragstart', function(event) {
        event.preventDefault();
    });
}

/**
 * @returns {boolean} true if Google Analytics loaded
 */
function gaPresent() {
    return typeof ga === "function";
}

/**
 * @param eventCategory
 * @param eventAction
 * @param eventLabel
 * @param eventValue
 * @param fieldsObject
 *
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/events
 */
function sendGaEvent(eventCategory, eventAction, eventLabel, eventValue, fieldsObject) {
    if (gaPresent()) {
        ga('send', 'event', eventCategory, eventAction, eventLabel, eventValue, fieldsObject);
    }
}
