#!/bin/bash
cd /var/www/html/

touch some-file

chmod 644 some-file

# NOTE: don't do this:
#exit 0