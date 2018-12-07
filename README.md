# The Lunch Picker [![GitHub version](https://badge.fury.io/gh/peterlopez%2Fthe-lunch-picker.svg)](https://github.com/peterlopez/the-lunch-picker/releases)

Find a bite to eat - [thelunchpicker.com](https://thelunchpicker.com)

## Requirements

1. Docker Compose v3.2
1. Node / npm
1. [Yelp API access token](https://www.yelp.com/developers/documentation/v3/authentication) in [Docker .env file](https://docs.docker.com/compose/environment-variables/#the-env-file)

#### For developing/testing newsletter feature

*\*optional*

1. Composer v1.7 for SendGrid API library 
1. [SendGrid API token](https://sendgrid.com/docs/ui/account-and-settings/api-keys/#creating-an-api-key) and [SendGrid Transactional Template ID](https://github.com/sendgrid/sendgrid-php/blob/master/USE_CASES.md#transactional-templates) in [Docker .env file](https://docs.docker.com/compose/environment-variables/#the-env-file)

## Development

Steps to setup local development environment:

1. `git clone`
1. `npm install`
1. `docker-compose up -d`
1. `php composer.phar install` *optional for newsletter
1. `gulp watch`
1. develop away!

## Contributing

If you're interested in making this web app better you can start by checking open issues and pull requests on GitHub. 

#### code style and setup

* PHP - handles Yelp API communication and Newsletter feature
  * scripts called via AJAX should be very minimal and only do a few things: validate request and input, start necessary action if any, and output response
  * the majority of server side functionality should be contained in PHP classes specific to a few tasks.
  * use `boolean` variables for long conditionals i.e.
    * `$formIsInvalid = empty($_POST['realemailaddress']) || empty($_POST['cuisines']) || empty($_POST['location']);`
* JS
  * almost all JS should written inside functions within `Object`s for the features they represent.
  * each `Object` should have an `init()` function which will bind any necessary event handlers. Then, other functions can be called as they are triggered by callbacks or by other functions. 
  * each of these `Object`s should be available globally (attached to `window`). For example `Filters.reset()` or `Filters.$container` should be available to call from anywhere.
* SCSS
  * use [BEM](http://getbem.com/introduction/)
  * try not to nest selectors too deep
* Gulp build process
  * all files in `js/` are compiled and minified together and placed in `build/`. Therefore, there should be no dependencies on any code running before another. Use callbacks instead.
  * all files in `scss/` are compiled and minified together and placed in `build/`. Variables and mixins should be placed in files starting with and underscore `_` to make sure they are compiled first.
