/**
 *
 * @constructor
 */
function Email()
{
    /**
     * selectors for elements of subscribe form
     * that appears within featherlight popup
     *
     * @type {string}
     */
    this.descriptionMessage = "#email-subscribe-form .description";
    this.emailInput = "#email-subscribe-form input[type='email']";
    this.locationInput = "#email-subscribe-form .location-content input";
    this.cuisineInputs = "#email-subscribe-form .cuisines-list input";

    this.continueBtns = "#email-subscribe-form .btn-primary";
    this.backBtns = "#email-subscribe-form .btn-secondary";
    this.submitBtn = "#email-subscribe-form .btn[type='submit']";
    this.$successBtn = $("#email-subscribe-form .success-confirmation button");

    this.$successDialog = $("#email-subscribe-form .success-confirmation");

    /**
     * @callback document.ready
     */
    this.init = function () {
        this.bindEventHandlers();
    };

    /**
     *
     */
    this.bindEventHandlers = function()
    {
        // prevent submitting form when hitting "enter" key in inputs
        $document.on('keypress', ':input:not(textarea)', function(event) {
            if (event.which === 13) {
                event.preventDefault();
            }
        });

        $document.on('keypress change', this.emailInput, this.validateEmail);
        $document.on('keypress change', this.locationInput, this.validateLocation);
        $document.on('change', this.cuisineInputs, this.validateCuisines);

        $document.on('click', this.continueBtns, this.stepForward);
        $document.on('click', this.backBtns, this.stepBackward);

        $document.on('click', this.submitBtn, this.submitForm);

        this.$successBtn.on('click', function() {
            if ($.featherlight.current() !== null) {
                $.featherlight.current().close();
            }
        })
    };

    /**
     * @param {event} event
     */
    this.validateEmail = function(event)
    {
        var $continueBtn = $(this).siblings(".btn-primary");

        // continue if enter key pressed and email is valid
        if (event.which === 13 && isValidEmail($(this).val())) {
            $continueBtn.trigger('click');
        }

        // enable continue button if email is valid
        if(isValidEmail($(this).val())) {
            $continueBtn.prop('disabled', false);
        } else {
            $continueBtn.prop('disabled', true);
        }
    };

    /**
     * @param {event} event
     */
    this.validateLocation = function(event)
    {
        var $continueBtn = $(this).siblings(".btn-primary");

        var inputIsValid = $(this).val().length > 0;

        // continue if enter key pressed and email is valid
        if (event.which === 13 && inputIsValid) {
            event.preventDefault();
            $continueBtn.trigger('click');
        }

        if (inputIsValid) {
            $continueBtn.prop('disabled', false);
        } else {
            $continueBtn.prop('disabled', true);
        }
    };

    /**
     * @param {event} event
     */
    this.validateCuisines = function(event)
    {
        var $continueBtn = $(this).siblings(".btn-primary");

        var cuisineSelected = $(this).val().length > 0;

        // continue if enter key pressed and email is valid
        if (event.which === 13 && inputIsValid) {
            $continueBtn.trigger('click');
        }

        if (inputIsValid) {
            $continueBtn.prop('disabled', false);
        } else {
            $continueBtn.prop('disabled', true);
        }
    };

    /**
     * @param {event} event
     */
    this.stepForward = function(event)
    {
        var $this = $(this);

        // do nothing on last step
        var nextStepNum = $this.data('next-step');
        if (typeof nextStepNum === "undefined") {
            return;
        }

        // hide current step
        var $currentStep = $this.parent();
        $currentStep.addClass('hidden');
        $currentStep.removeClass('active');

        // show next step
        var $nextStep = $this.parent().siblings("div[data-step='"+nextStepNum+"']");
        $nextStep.removeClass('hidden'); //fadeIn('fast');
        $nextStep.addClass('active');
        $nextStep.find("input").focus();
    };

    /**
     * @param {event} event
     */
    this.stepBackward = function(event)
    {
        var $this = $(this);

        // hide current step
        var $currentStep = $this.parent();
        $currentStep.addClass('hidden');
        $currentStep.removeClass('active');

        // show next step
        var prevStepNum = $this.data('prev-step');
        var $prevStep = $this.parent().siblings("div[data-step='"+prevStepNum+"']");
        $prevStep.removeClass('hidden'); //fadeIn('fast');
        $prevStep.addClass('active');
        $prevStep.find("input").focus();
    };

    /**
     * @param {event} event
     */
    this.submitForm = function(event)
    {
        event.preventDefault();

        $.ajax({
            type: "POST",
            url: './subscribe',
            data: $("#email-subscribe-form").serialize(),
            success: Email.successCallback,
            error: Email.errorCallback
        });
    };

    /**
     * @callback from AJAX request to subscribe.php
     */
    this.successCallback = function(data)
    {
        // hide description message
        $(Email.descriptionMessage).hide();

        // hide active content
        var $activeStep = $("#email-subscribe-form .active");
        $activeStep.hide();

        // show success dialog
        Email.$successDialog.removeClass('hidden');
    };


    /**
     *
     * Display message to user that there was an
     * issue with the server response
     *
     * @param {jqXHR} jqXHR
     * @param {String} textStatus
     * @param {String} errorThrown
     *
     * @callback from AJAX request to subscribe.php
     *
     */
    this.errorCallback = function(jqXHR, textStatus, errorThrown)
    {
        console.log('error');console.log(jqXHR);
        // $("#spinner .loading-container p").text("Oops! There was a error.");
        // $("#spinner .loading-container img").prop('src', 'assets/img/error.svg');
        //
        // sendGaEvent('Spinner', 'error', null, {nonInteraction: true});
    };
};
