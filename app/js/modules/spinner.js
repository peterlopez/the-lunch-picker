/**
 * vertical top-to-bottom Spinner
 *
 * start by measuring each item and the amount of visible items.
 * then, append a certain number of items to the list
 * finally, calculate CSS transform animation and
 * in order to have a "winning" item in the middle slot
 *
 * @constructor
 */
function Spinner()
{
    this.$spinner = $("#spinner");
    this.$spinBtn = $("#btn-spin");
    this.listCSSClass = 'spinner-content';

    /**
     * Warning!
     * These DOM element properties are functions:
     *   this.$items()
     */
    /**
     * @returns {jQuery|HTMLElement}
     */
    this.$list = function() {
        return $("."+this.listCSSClass);
    };
    /**
     * @returns {jQuery|HTMLElement}
     */
    this.$items = function() {
        return $("#spinner .item");
    };
    /**
     * @returns {int}
     */
    this.numItems = function() {
        return this.$items().length;
    };


    /**
     * This element sits outside the spinner and gets copied into spinner
     *
     * @type {jQuery|HTMLElement}
     */
    this.$loadingScreen = $(".loading-container");

    /**
     * index of item in original list
     * picked to be winner
     *
     * @type {number}
     */
    this.winner = 0;

    /**
     * item in list which will be at center of container
     * when spinner stops spinning
     *
     * @type {null}
     */
    this.$winningItem = null;

    this.baseSpeed = .6; // in px per ms
    this.speed = 1; // in px per ms
    this.duration = 2400; // in ms
    this.speedUpDuration = 400; // in ms
    this.slowDownDuration = 300; // in ms

    this.numItems = 0;
    this.numVisibleItems = 0;
    this.stopItemNumber = 0;

    /**
     * Essential for calculating pixels to scroll
     *
     * @type {number}
     */
    this.itemHeight = 0;

    /**
     * Fixed height container of visible items
     *
     * @type {number}
     */
    this.containerHeight = 0;

    // /**
    //  * current = middle of the visible list
    //  * next = 1st item outside of visible list
    //  *
    //  * @type {number}
    //  */
    // this.currentItem = 0;
    // this.$currentItem = null;
    // this.nextItem = 0;
    // this.$nextItem = null;

    /**
     * @callback from Spinner.update()
     */
    this.init = function() {
        Spinner.$spinner.scrollTop(0);
        Spinner.$list().css('transition-duration', '0s');
        Spinner.$list().css('transform', 'translate(0, 0)');

        // calculate heights
        this.itemHeight = this.$items().outerHeight();
        this.containerHeight = this.$spinner.outerHeight();

        // get item stats
        this.originalListLength = this.$items().length;
        this.numVisibleItems = Math.round(this.containerHeight / this.itemHeight);
        // this.currentItem = Math.round(this.numVisibleItems / 2) - 1;
        // this.$currentItem = this.$items()[this.currentItem];

        // add extra items to list
        this.distanceTotal = this.getDistanceTotal(true);
        this.numItemsToAdd = this.getNumItemsToAdd(this.distanceTotal);
        this.addExtraItemsToList(this.numItemsToAdd);

        // pick a winner
        this.winner = this.pickWinner();
        // console.log("winning number: "+this.winning);

        this.bindEventHandlers();
    };


    /**
     * @callback from Yelp.success()
     */
    this.update = function(data)
    {
        Spinner.$spinBtn.prop('disabled', false);

        var output = "<div class='" + Spinner.listCSSClass + "'>";
        var restaurants = data['businesses'];
        restaurants = shuffle(restaurants);
        for(var i=0; i < restaurants.length; i++) {
            var restaurant = restaurants[i];
            output += "<div class='restaurant item'><a href='" + restaurant['url'] + "' target='_blank'>";
            output +=   "<p class='restaurant-name'>" + restaurant['name'] + "</p>";
            output += "</a></div>";
        }
        output += "</div>";

        Spinner.$spinner.html(output);
        Spinner.$spinner.removeClass('nonscrollable');
        Spinner.init();
    };

    /**
     * @callback Spinner.init()
     */
    this.bindEventHandlers = function()
    {
        this.$spinBtn.on('click', this.spin);

        $document.on('click', '.restaurant a', function(event) {
            event.preventDefault();
            sendGaEvent('Outbound Link', 'click', null, this.href, {transport: 'beacon'});
            window.open(this.href);
        });
    };

    /**
     * Copies div containing loading content
     * into spinner unless already there
     */
    this.displayLoadingScreen = function()
    {
        var exsitingLoadScreen = this.$spinner.find(".loading-container");
        if (exsitingLoadScreen.length > 0) {
            return;
        }

        this.$spinner.addClass("loading");
        this.$spinner.html(this.$loadingScreen);
    };

    /**
     * @return {number} random index of original list
     */
    this.pickWinner = function()
    {
        return Math.floor(Math.random() * Math.floor(Spinner.originalListLength));
    };

    /**
     * @param {boolean} fresh
     * @returns {number}
     */
    this.getDistanceTotal = function(fresh)
    {
        if (this.distanceTotal !== null && !fresh) {
            return this.distanceTotal;
        }
        var distanceTotal = 0;

        //
        // calculate distance for acceleration and deceleration
        //

        // ratio of time accelerating to total time
        this.accelFactor = this.speedUpDuration / this.duration;
        this.decelFactor = this.slowDownDuration / this.duration;

        var extraDistanceAccel = this.speedUpDuration * (this.baseSpeed + (this.baseSpeed * this.accelFactor)); // compound this over duration
        var extraDistanceDecel = this.slowDownDuration * (this.baseSpeed + (this.baseSpeed * this.decelFactor)); // compound this over duration
        distanceTotal += extraDistanceAccel + extraDistanceDecel;

        // calculate distance going constant speed (not accelerating or decelerating)
        distanceTotal += (this.baseSpeed * (this.duration - this.slowDownDuration - this.speedUpDuration));
        return distanceTotal;
    };

    /**
     * @param distanceTotal
     * @returns {number}
     */
    this.getNumItemsToAdd = function(distanceTotal)
    {
        // divide by item height
        var numItemsToAdd = Math.round(distanceTotal / this.itemHeight);
        return numItemsToAdd;
    };

    /**
     * @param {int} numItemsToAdd
     */
    this.addExtraItemsToList = function(numItemsToAdd)
    {
        var itemIndex = 0;
        var $items = this.$items();
        for(var i=0; i < numItemsToAdd; i++) {
            if (itemIndex >= this.originalListLength) {
                itemIndex = 0;
            } else {
                itemIndex++;
            }
            var $item = $($items[itemIndex]);
            this.$list().append($item.clone());
        }
    };

    /**
     * - move list back to top
     * - remove winner class
     * - pick new winner
     */
    this.reset = function()
    {
        // Scroll list back to top
        Spinner.$spinner.scrollTop(0);
        Spinner.$list().css('transition-duration', '0s');
        Spinner.$list().css('transform', 'translate(0, 0)');

        // Find new winner
        Spinner.$list().find(".winner").removeClass('winner');
        Spinner.winner = Spinner.pickWinner();
    };

    /**
     * @param {event} event
     */
    this.spin = function(event)
    {
        var listLength = Spinner.$items().length;

        Spinner.reset();

        Filters.$filterApplyBtn.fadeOut();
        Spinner.$spinBtn.prop('disabled', true);
        Spinner.$spinner.addClass('nonscrollable');

        //
        // This code is from back when I was thinking of queuing up
        // multiple transform animations:
        //  - speeding up
        //  - going constant
        //  - slowing down
        //
        // calculate stopping point of acceleration
        // var accelFinishPoint = Spinner.speedUpDuration * (Spinner.baseSpeed + (Spinner.baseSpeed * Spinner.accelFactor)); // compound this over duration
        // var accelFinishPoint = this.speedUpDuration * this.itemHeight;
        // var constantFinishPoint = accelFinishPoint + Spinner.distanceTotal - accelFinishPoint - (Spinner.slowDownDuration * (Spinner.baseSpeed + (Spinner.baseSpeed * Spinner.accelFactor)));
        //
        // 100% - (itemHeight * (list.length - winning))
        // var listHeight = Spinner.$list().height();
        // var visibleAreaHeight = Spinner.$list().outerHeight();
        // var heightOfListItemsToWinner = Spinner.itemHeight * (Spinner.numItems - Spinner.winning);

        /**
         * Index of winning item in full, repeated list of items
         * example:
         * winning item = item 8 of 20
         * total list length = 37 items
         * winner = item 25 of 37
         *
         * @var winner {int}
         **/
        var winner = listLength - (Spinner.originalListLength - Spinner.winner);

        var winningItem = Spinner.$items()[winner];
        Spinner.$winningItem = $(winningItem);

        /**
         * Calculate final stopping point of the animation
         * in order to end with winner in center
         *
         * @var decelFinishPoint {number}
         */
        var decelFinishPoint = (winner * Spinner.itemHeight) - Spinner.containerHeight;
        decelFinishPoint += Math.round(.5 * Spinner.numVisibleItems) * Spinner.itemHeight;

        // TODO
        // scroll up a little (wind up)
        // Spinner.$list().transition({ y: -decelFinishPoint+"px" }, Spinner.slowDownDuration, 'ease');

        // scroll to end
        Spinner.$list().css('transition-duration', Spinner.duration+'ms');
        Spinner.$list().css('transform', 'translate(0, -'+decelFinishPoint+'px)');

        // Tag winner
        var winnerItem = Spinner.$items()[winner];
        $(winnerItem).addClass('winner');

        // Unlock spin button to go again
        setTimeout(function() {
            Spinner.$spinBtn.prop('disabled', false);
            Spinner.$spinBtn.text("spin again!");
        }, Spinner.duration);

        sendGaEvent('Spinner', 'spin');
    };
}
