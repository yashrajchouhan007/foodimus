#!/bin/bash

DB_PASSWORD=$(head -c 18 /dev/urandom | base64 | tr '+' '_' | tr '/' '-')
cat .env \
    | sed -E "s/^DB_PASSWORD=$/DB_PASSWORD=$DB_PASSWORD/g" \
    > .env.edit

mv .env.edit .env

docker run --rm -v"$PWD:/var/www/html" php:8.0-fpm \
    php artisan key:generate