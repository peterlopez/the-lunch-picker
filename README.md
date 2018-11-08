# The Lunch Picker

Find a bite to eat - [thelunchpicker.com](https://thelunchpicker.com)

## Requirements

1. Docker Compose
1. Node / npm
1. [Yelp API access token](https://www.yelp.com/developers/documentation/v3/authentication) in [Docker .env file](https://docs.docker.com/compose/environment-variables/#the-env-file)

## Development

Steps to setup local development environment:
1. `git clone`
1. `npm install`
1. `gulp watch`
1. `docker-compose up`

## Contributing

Please [contact me](mailto:peter@phpete.me) if you're interested in making this web app better.

## TODO

Features/enhancements

1. Add spinner next to "locate me" link to indicate geolocation fetch in progress.
1. Add gradient effect to spinner/roulette
1. Add modal functionality for filters on mobile
1. Add linting and compressing JS and CSS Gulp tasks

Bug fixes

1. Weird spinner behavior on mobile
    * If spin button is clicked multiple times or clicked before spinner finishes spinning, then the spinner can start spinning backwards and forwards until it slowly reaches it's destination. 
