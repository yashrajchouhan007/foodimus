#!/bin/bash

__DIR=`dirname $0`

npx dotenv envsubst <<EOF | \
    openssl req \
        -x509 \
        -newkey rsa:4096 \
        -keyout ssl/priv.key \
        -out ssl/cert.crt \
        -days 3650 \
        -nodes \
        -config /dev/stdin
[ req ]
default_bits       = 4096
distinguished_name = req_distinguished_name
req_extensions     = req_ext
x509_extensions    = req_ext
extensions         = req_ext
prompt             = no

[ req_distinguished_name ]
commonName                  = \$APP_NAME.dev

[ req_ext ]
subjectAltName = @alternate_names

[ alternate_names ]
DNS.1        = www.\${APP_NAME}.dev
DNS.2        = \${APP_NAME}.dev
IP.3         = 127.0.0.1
EOF
