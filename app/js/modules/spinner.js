/**
 *
 * @constructor
 */
function Spinner()
{
    this.$spinner = $("#spinner");
    this.$spinBtn = $("#btn-spin");
    this.$loadingScreen = $(".loading-container");

    this.rouletteOptions = {
        speed: 8,
        duration: 2, // in seconds
        // stopImageNumber: 0,

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

    this.init = function() {
        this.bindEventHandlers();
    };

    this.bindEventHandlers = function()
    {
        this.$spinBtn.on('click', this.spin);
    };

    /**
     *
     */
    this.spin = function()
    {
        Filters.$filterApplyBtn.fadeOut();

        // var numItems = $(".restaurant").length;
        // rouletteOptions.stopImageNumber = Math.floor(Math.random() * numItems) + 1;

        var roulette = $('#spinner');
        roulette.roulette(this.rouletteOptions);
        roulette.roulette('start');
    };

    /**
     *
     */
    this.displayLoadingScreen = function()
    {
        this.$spinner.addClass("loading");
        var $loadingScreen = this.$loadingScreen.clone();
        this.$spinner.html($loadingScreen);
        $loadingScreen.fadeIn();
    }
}