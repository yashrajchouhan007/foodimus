#!/bin/bash
set -e

npm install
docker run --rm -v"$PWD:/app" composer install --ignore-platform-reqs

if [[ ! -e .env ]]; then
    cp .env.example .env
    bash scripts/dotenv.sh
fi


if [[ ! -e ssl/cert.crt || ! -e ssl/priv.key ]]; then
    bash scripts/ssl.sh
fi