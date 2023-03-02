# Getting started

## Prerequisites

- Docker desktop
- Node version 16 or up with NPM 8 or up

## Recommended installation procedure for Node

It is recommended to install NVM to manage your installed versions of Node. For macOS, you need to install Homebrew before being able to install NVM. For instructions, please see [brew.sh](https://brew.sh).

To install NVM on macOS, run `brew install nvm`.
> NOTE: you need to run a few commands before you can use the nvm command line interface. These are shown in the output from brew after installing nvm.

After this, install the correct version of node:

```bash
nvm install 16
nvm alias default 16
nvm use 16
```

## Installing dependencies and setting everything up

When starting a new project, make sure you edit the .env.example file and set the `APP_NAME` correctly.

```bash
npm run init
```

## Starting the stack

Start up the laravel sail development stack:
```bash
npm run sail
```

## Starting the front-end

In a separate terminal, run the compiler in hot reload mode, to start watching for changes to the front end:
```bash
npm run hot
```

# Usage
When the sail stack is up and running, point your webbrowser to `http://localhost` to access the server.

# SSL
The `npm run init`-script automatically creates a self-signed SSL certificate in the `ssl/` folder. The DNS name is expected to be `{APP_NAME}.dev` or `www.{APP_NAME}.dev`, so set your hosts file accordingly.

You probably also want to add `ssl/cert.crt` to your trust store if you want to use SSL.

# Local MySQL connection details

```
server: localhost
port: 3306
username: {APP_NAME}
password: {DB_PASSWORD}
database: {APP_NAME}
```