#!/bin/bash

cat <<EOF >> /var/www/html/public/.htaccess
#Protect Directory
AuthName "Wiredev"
AuthType Basic
AuthUserFile /var/www/html/.htpasswd
Require valid-user
EOF