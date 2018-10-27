/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}

				// Considers RFC 6265 section 5.2:
				// ...
				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
				//     character:
				// Consume the characters of the unparsed-attributes up to,
				// not including, the first %x3B (";") character.
				// ...
				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
			}

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

(function($) {
    var Roulette = function(options) {
        var defaultSettings = {
            maxPlayCount : null, // x >= 0 or null
            speed : 10, // x > 0
            stopImageNumber : null, // x >= 0 or null or -1
            rollCount : 3, // x >= 0
            duration : 3, //(x second)
            stopCallback : function() {
            },
            startCallback : function() {
            },
            slowDownCallback : function() {
            }
        };
        var defaultProperty = {
            playCount : 0,
            $rouletteTarget : null,
            imageCount : null,
            $images : null,
            originalStopImageNumber : null,
            totalHeight : null,
            topPosition : 0,

            maxDistance : null,
            slowDownStartDistance : null,

            isRunUp : true,
            isSlowdown : false,
            isStop : false,

            distance : 0,
            runUpDistance : null,
            slowdownTimer : null,
            isIE : navigator.userAgent.toLowerCase().indexOf('msie') > -1 // TODO IE
        };

        var p = $.extend({}, defaultSettings, options, defaultProperty);

        /**
         *
         */
        var reset = function() {
            p.maxDistance = defaultProperty.maxDistance;
            p.slowDownStartDistance = defaultProperty.slowDownStartDistance;
            p.distance = defaultProperty.distance;
            p.isRunUp = defaultProperty.isRunUp;
            p.isSlowdown = defaultProperty.isSlowdown;
            p.isStop = defaultProperty.isStop;
            p.topPosition = defaultProperty.topPosition;

            clearTimeout(p.slowDownTimer);
        };

        /**
         *
         */
        var slowDownSetup = function() {
            if(p.isSlowdown){
                return;
            }
            p.slowDownCallback();
            p.isSlowdown = true;
            p.slowDownStartDistance = p.distance;
            p.maxDistance = p.distance + (2*p.totalHeight);
            p.maxDistance += p.imageHeight - p.topPosition % p.imageHeight;
            if (p.stopImageNumber != null) {
                p.maxDistance += (p.totalHeight - (p.maxDistance % p.totalHeight) + (p.stopImageNumber * p.imageHeight))
                    % p.totalHeight;
            }
        };


        /**
         *
         */
        var roll = function() {
            var speed_ = p.speed;

            if (p.isRunUp) {
                if (p.distance <= p.runUpDistance) {
                    var rate_ = ~~((p.distance / p.runUpDistance) * p.speed);
                    speed_ = rate_ + 1;
                } else {
                    p.isRunUp = false;
                }

            } else if (p.isSlowdown) {
                var rate_ = ~~(((p.maxDistance - p.distance) / (p.maxDistance - p.slowDownStartDistance)) * (p.speed));
                speed_ = rate_ + 1;
            }

            if (p.maxDistance && p.distance >= (p.maxDistance)) {
                p.isStop = true;
                console.log("p.maxDistance: "+p.maxDistance);
                console.log("p.distance: "+p.distance);
                reset();
                p.stopCallback(p.$rouletteTarget.find('.restaurant').eq(p.stopImageNumber));
                return;
            }
            p.distance += speed_;
            p.topPosition += speed_;
            if (p.topPosition >= p.totalHeight) {
                p.topPosition = p.topPosition - p.totalHeight;
            }
            // TODO IE
            if (p.isIE) {
                p.$rouletteTarget.css('top', '-' + p.topPosition + 'px');
            } else {
                // TODO more smooth roll
                p.$rouletteTarget.css('transform', 'translate(0px, -' + p.topPosition + 'px)');
            }
            setTimeout(roll, 1);
        };

        /**
         *
         */
        var init = function($roulette) {
            $roulette.css({ 'overflow' : 'hidden' });
            defaultProperty.originalStopImageNumber = p.stopImageNumber;
            if (!p.$images) {
                p.$images = $roulette.find('.restaurant');
                p.imageCount = p.$images.length;

                p.imageHeight = p.$images.eq(0).eq(0).height();
                console.log("p.imageHeight: "+p.imageHeight);

                $roulette.css({ 'height' : (p.imageHeight + 'px') });
                p.totalHeight = p.imageCount * p.imageHeight;
                p.runUpDistance = 2 * p.imageHeight;

                p.$images.remove();
            }
            // $roulette.find('div').remove();
            p.$images.css({
                'display' : 'block'
            });
            p.$rouletteTarget = $('<div>').css({
                'position' : 'relative',
                'top' : '0'
            }).attr('class',"roulette-inner");


            $roulette.append(p.$rouletteTarget);
            p.$rouletteTarget.append(p.$images);
            p.$rouletteTarget.append(p.$images.eq(0).clone());
            $roulette.show();
        };

        /**
         *
         */
        var start = function() {
            p.playCount++;
            if (p.maxPlayCount && p.playCount > p.maxPlayCount) {
                return;
            }

            // define stop image
            p.stopImageNumber = $.isNumeric(defaultProperty.originalStopImageNumber) && Number(defaultProperty.originalStopImageNumber) >= 0 ?
                Number(defaultProperty.originalStopImageNumber) : Math.floor(Math.random() * p.imageCount);

            console.log("Stopping at image number "+p.stopImageNumber);

            // fire custom start callback
            p.startCallback();

            // Start rolling
            console.log("rolling...");
            roll();

            // Set timer for slow down
            p.slowDownTimer = setTimeout(function() {
                console.log("slowing down");
                slowDownSetup();
            }, p.duration * 1000);
        };

        /**
         *
         */
        var stop = function(option) {
            if (!p.isSlowdown) {
                if (option) {
                    var stopImageNumber = Number(option.stopImageNumber);
                    if (0 <= stopImageNumber && stopImageNumber <= (p.imageCount - 1)) {
                        p.stopImageNumber = option.stopImageNumber;
                    }
                }
                slowDownSetup();
            }
        };

        /**
         *
         */
        var option = function(options) {
            p = $.extend(p, options);
            p.speed = Number(p.speed);
            p.duration = Number(p.duration);
            p.duration = p.duration > 1 ? p.duration - 1 : 1;
            defaultProperty.originalStopImageNumber = options.stopImageNumber;
        };

        var ret = {
            start : start,
            stop : stop,
            init : init,
            option : option
        };
        return ret;
    };

    var pluginName = 'roulette';
    $.fn[pluginName] = function(method, options) {
        return this.each(function() {
            var self = $(this);
            var roulette = self.data('plugin_' + pluginName);

            if (roulette) {
                if (roulette[method]) {
                    roulette[method](options);
                } else {
                    console && console.error('Method ' + method + ' does not exist on jQuery.roulette');
                }
            } else {
                roulette = new Roulette(method);
                roulette.init(self, method);
                $(this).data('plugin_' + pluginName, roulette);
            }
        });
    }
})(jQuery);

/**
 *
 * @constructor
 */
function Yelp()
{
    this.cuisines = {
        'restaurants': 'All',
        'american': 'American',
        'bbq': 'BBQ',
        'pizza': 'Pizza',
        'delis': 'Delis',
        'indian': 'Indian',
        'hotdogs': 'Fast Food',
        "japanese": 'Japanese',
        "italian": 'Italian',
        "mediterranean": 'Mediterranean',
        "mexican": 'Mexican',
        "vegan": 'Vegan'
    };


    /**
     *
     */
    this.updateRestaurants = function(data)
    {
        console.log(data);

        var output = '';
        var restaurants = data['businesses'];
        restaurants = shuffle(restaurants);
        for(var i=0; i < restaurants.length; i++) {
            var restaurant = restaurants[i];
            output += "<div class='restaurant'><a href='" + restaurant['url'] + "' target='_blank'>";
            output += "<p class='restaurant-name'>" + restaurant['name'] + "</p>";
            output += "</a></div>";
        }

        $("#spinner").html(output);
    };


    /**
     *
     */
    this.updateCuisines = function(data)
    {

    }
}

window.yelp = new Yelp();

var rouletteOptions = {
    speed: 8,
    duration: 2, // in seconds
    stopImageNumber: 0, // set this randomly later

    startCallback : function() {
        console.log('start');
        $("#btn-spin").prop('disabled', true);
    },
    slowDownCallback : function() {
        console.log('slowDown');
    },
    stopCallback : function($stopEl) {
        console.log('stop');
        $($stopEl).addClass('winner');
        $("#btn-spin").prop('disabled', false);
    }
};

/**
 * Filter toggle event handlers
 */
$(document).ready(function() {
    $("#cuisines").click(function() {
        $("#cuisines-list").toggle();
        $(this).toggleClass("flyout-open");
    });
    $('#cuisines-list').on('click', function (event) {
        event.stopPropagation();
    });
    $("#location").click(function() {
        $("#location-content").toggle();
        $(this).toggleClass("flyout-open");
    });
    $('#location-content').on('click', function (event) {
        event.stopPropagation();
    });
});


/**
 * Filter change event handlers
 */
$(document).ready(function() {
    $('#location input').on('keypress', function (e) {
        $("#btn-filter-apply").fadeIn();

        if (e.which === 13) {
            e.preventDefault();
            $("#location.filter").trigger('click');
            $("#btn-filter-apply").trigger('click');
            $("#btn-filter-apply").hide();
        }

        e.stopPropagation();
    });

    $("#cuisines-list input").change(function() {
        $("#btn-filter-apply").fadeIn();
    });
});


/**
 * Apply filters button event handler
 */
$(document).ready(function() {
    $("#btn-filter-apply").click(function() {
        console.log("updating restaurants");

        // Set cookies
        var $selectedCuisines = $("#cuisines-list input:checked");
        var selectedCuisines = [];
        $selectedCuisines.each(function() {
            if ($(this).val() === "all") {
                return;
            }
            selectedCuisines.push($(this).val());
        });
        Cookies.set('cuisines', JSON.stringify(selectedCuisines));
        var location = $("#location-content input").val();
        Cookies.set('location', location);

        // Display loading screen
        var $loadingScreen = $(".loading-container").clone();
        $("#spinner").html($loadingScreen);
        $loadingScreen.fadeIn();
        $(this).fadeOut();

        // Make API request
        $.ajax({
            type: "GET",
            url: './yelp.php',
            data: $("#filter-form").serialize(),
            success: function(data) {
                yelp.updateRestaurants(data);
                yelp.updateCuisines(data);
            }
        });
    });
});


/**
 * Use cookies to remember cuisines and location filters
 */
$(document).ready(function() {
    var cuisinesCookie = Cookies.get('cuisines');
    if (typeof cuisinesCookie !== "undefined") {
        // decode into array
        // iterate array and check each box with that value
        var checkboxes = $("#cuisines-list input");
        checkboxes.each(function() {
            var cuisine = $(this).val();

            if (cuisinesCookie.indexOf(cuisine) !== -1) {
                $(this).prop('checked', true);
            }
            else {
                $(this).prop('checked', false);
            }
        });
    }

    var locationCookie = Cookies.get('location');
    if (typeof locationCookie !== "undefined") {
        $("#location-content input").val(locationCookie)
    }
});

/**
 *
 */
$(document).ready(function() {
    $(document).click(function() {
        $("#location-content").hide();
        $("#cuisines-list").hide();
    });

    $("#location.filter, #cuisines.filter, #location-content, #cuisines-list").on('click', function(e) {
        e.stopPropagation();
    });
});


/**
 * Spin!
 */
$(document).ready(function() {
    $("#btn-spin").click(function() {
        $("#btn-filter-apply").fadeOut();

        var numItems = $(".restaurant").length;
        rouletteOptions.stopImageNumber = Math.floor(Math.random() * numItems) + 1;

        var roulette = $('#spinner');
        roulette.roulette(rouletteOptions);
        roulette.roulette('start');
    });
});

/**
 * Select all cuisines checkbox
 */
$(document).ready(function() {
    $("#all-checkbox").change(function() {
        $(this).prop('checked', !$(this).prop('checked'));

        var $cuisines = $("#cuisines-list input");
        $cuisines.each(function() {
            $(this).prop('checked', !$(this).prop('checked'));
        });
    })
});

/**
 * Trigger initial request
 */
$(document).ready(function() {
    $("#btn-filter-apply").trigger('click');
});


// $(document).ready(function() {
//     var svg = document.getElementById("logo");
//
// // Get the real bounding box of the icon shape
//     var bbox = svg.getBBox();
//
// // Get the viewBox width and height
//     var viewBox_width = svg.viewBox.baseVal.width;
//     var viewBox_height = svg.viewBox.baseVal.height;
//
// // Recenter the contents
//     svg.viewBox.baseVal.x = bbox.x - (viewBox_width - bbox.width) / 2;
//     svg.viewBox.baseVal.y = bbox.y - (viewBox_height - bbox.height) / 2;
// });

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


function geolocationChange() {

}

/**
 *
 * @param linkText
 * @param inputName
 * @param inputValue
 * @param inputHidden
 */
function locationReset(linkText, inputName, inputValue, inputHidden) {
    var $locationInput = $("#location-content input");

    $locationInput.val(inputValue);
    $locationInput.prop('name', inputName);

    // Remove input field
    if (inputHidden) {
        $locationInput.hide();
    } else {
        $locationInput.show();
    }

    // Change link to remove geolocation
    var $locationLink = $("#location-content a");
    $locationLink.text(linkText);
}

/**
 *
 */
$(document).ready(function() {
    if (!navigator.geolocation){
        $(".geolocate").remove();
        return;
    }

    $(".geolocate").click(function() {
        // Found cookie
        var geolocationCookie = Cookies.get('geolocation');
        console.log("geolocationCookie: "+geolocationCookie);
        if (typeof geolocationCookie !== "undefined") {
            console.log("found geolocation cookie");

            // Hide input and set geolocation cookie
            locationReset('forget me', 'geolocation', geolocationCookie, true);
            var $locationLink = $("#location-content a");
            $locationLink.bind('click', removeGeolocation);

            // apply filters
            $("#btn-filter-apply").trigger('click');
            return;
        }

        // Request geolocation
        console.log("fetching geolocation");
        navigator.geolocation.getCurrentPosition(success, error);
        function success(position) {
            console.log("success fetching geolocation");
            var latitude  = position.coords.latitude;
            var longitude = position.coords.longitude;

            var $locationInput = $("#location-content input");

            // Set cookie
            var geolocation = JSON.stringify({'lat': latitude, 'lng': longitude});
            Cookies.set('geolocation', geolocation);
            $locationInput.val(geolocation);

            // Hide input and set geolocation cookie
            locationReset('forget me', 'geolocation', geolocationCookie, true);
            var $locationLink = $("#location-content a");
            $locationLink.bind('click', removeGeolocation);

            // apply filters
            $("#btn-filter-apply").trigger('click');
        }

        function error() {
            return "Unable to retrieve your location";
        }
    });


    function removeGeolocation() {
        // remove cookie
        Cookies.remove('geolocation');

        var locationCookie = Cookies.get('location');
        locationReset('locate me', 'location', locationCookie, false);

        // change back name of input
        var $locationInput = $("#location-content input");
        $locationInput.prop('name', 'location');
        $locationInput.val("");

        // change back link
        var $locationLink = $("#location-content a");
        $locationLink.text("locate me");
        $locationLink.removeClass("remove-geolocate");
        $locationLink.addClass("geolocate");

    }
});


// Auto fetch location

// Filter out cuisines which don't apply
