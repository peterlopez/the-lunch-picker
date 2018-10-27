FROM php:5.6-apache
MAINTAINER Peter Lopez <peter@phpete.me>
LABEL   Description="Plain ole' Apache and PHP" \
        Usage="docker run -d [DOCROOT]:/var/www/html"

COPY app /var/www/html

RUN a2enmod rewrite
