/**
 * This class handles functionality for registering users
 * for the newsletter
 *
 * A multi step form is presented in a 'featherlight' popup
 * in order for users to input data which makes up
 * AJAX request to script: subscribe.php
 *
 * Stepping forward and backward through the form
 * is reliant on HTML data- attributes
 *
 * @constructor
 */
function Email()
{
    /**
     * elements of newsletter form
     *
     * @type {object} jQuery
     */
    this.$explainText = $(".newsletter__form .newsletter__explaintext");
    this.$emailInput = $(".newsletter__form .newsletter__emailinput");
    this.$locationInput = $(".newsletter__form .newsletter__locationinput");

    // Buttons
    this.$continueBtns = $(".newsletter__form .btn-primary");
    this.$backBtns = $(".newsletter__form .btn-secondary");
    this.$submitBtn = $(".newsletter__form .btn[type='submit']");
    this.$successBtn = $(".newsletter__form .newsletter__confirm button");

    this.$successDialog = $(".newsletter__form .newsletter__confirm");

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
        // prevent submitting form when hitting "enter" key when focused on inputs
        $document.on('keypress', ':input:not(textarea)', function(event) {
            if (event.which === 13) {
                event.preventDefault();
            }
        });

        // enable / disable forward progress buttons until fields are valid
        this.$emailInput.on('keypress change', this.validateEmail);
        this.$locationInput.on('keypress change', this.validateLocation);

        // Forward / backward buttons
        this.$continueBtns.on('click', this.stepForward);
        this.$backBtns.on('click', this.stepBackward);

        // Send AJAX request instead of default
        this.$submitBtn.on('click', this.submitForm);

        // Button on final page for closing featherlight
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
        var $labelEl = $(this).parent(); // input is contained in label
        var $continueBtn = $labelEl.siblings(".btn-primary");

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
    this.stepForward = function(event)
    {
        var $this = $(this);

        // do nothing on last step
        var nextStepNum = $this.data('next-step');
        if (typeof nextStepNum === "undefined") {
            return;
        }

        // hide current step
        var $currentStep = $this.parents('.newsletter__step');
        $currentStep.addClass('hidden');
        $currentStep.removeClass('active');

        // show next step
        var $nextStep = $this.parents('.newsletter__step').siblings("div[data-step='"+nextStepNum+"']");
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
        var $currentStep = $this.parents('.newsletter__step');
        $currentStep.addClass('hidden');
        $currentStep.removeClass('active');

        // show next step
        var prevStepNum = $this.data('prev-step');
        var $prevStep = $this.parents('.newsletter__step').siblings("div[data-step='"+prevStepNum+"']");
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
            data: $(".newsletter__form").serialize(),
            success: Email.successCallback,
            error: Email.errorCallback
        });
    };

    /**
     * @callback from AJAX request to subscribe.php
     */
    this.successCallback = function(data)
    {
        // hide explain text
        Email.$explainText.hide();

        // hide active content
        var $activeStep = $(".newsletter__form .active");
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
