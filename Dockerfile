FROM php:5.6-apache
MAINTAINER Peter Lopez <peter@phpete.me>
LABEL   Description="Plain ole' Apache and PHP" \
        Usage="docker run -v [DOCROOT]:/var/www/html"

COPY yelp-credentials.json /etc/opt

RUN a2enmod rewrite
