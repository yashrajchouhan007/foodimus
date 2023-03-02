#!/bin/bash
CI="0"
BUILD_ENV="$1"
if [[ "$BUILD_ENV" == "" ]] ; then
    BUILD_ENV="accept"
fi

if [[ "$BUILD_ENV" != "prod" && "$BUILD_ENV" != "accept" ]] ; then
    echo "Usage $0 [prod|accept]"
    exit 1
fi

set -e

if [[ "$CI" == "1" ]]; then
    #TODO: validate that this works
    npm ci
else
    npm install --include=dev
fi

if [ -e .build ]; then
    rm -rf .build
fi

mkdir .build

cp .env.${BUILD_ENV} .build/.env

npm run production

rsync -a --progress . .build/ --exclude \
    --exclude=".build" \
    --exclude=".git" \
    --exclude=".husky" \
    --exclude="ssl" \
    --exclude="docker" \
    --exclude="tests" \
    --exclude=".vscode" \
    --exclude="vendor" \
    --exclude="dist.tar.gz" \
    --exclude="build-assets" \
    --exclude="node_modules" \
    --exclude="resources/js" \
    --exclude="resources/css" \
    --exclude="resources/images" \
    --exclude=".env*"

cp -r build-assets/${BUILD_ENV}/. .build/

echo "Installing PHP dependencies"
docker run --rm -v"$PWD/.build:/app" composer install --ignore-platform-reqs --no-dev 

(
    cd .build
    if [ -e ../dist.tar.gz ]; then
        rm ../dist.tar.gz
    fi
    tar cfvz ../dist.tar.gz .
)


