#!/bin/bash

usage () {
    echo Usage: $0 '{ dev | prod }'
    exit 1
}

DEFAULT_ENV_FILE=/home/usersmanagement/env.sh

: ${ENV_FILE:=$DEFAULT_ENV_FILE}

if [ -r $ENV_FILE ]; then
    . $ENV_FILE
else
    echo $ENV_FILE not found
    echo Please place $(basename $ENV_FILE) in $(dirname $ENV_fILE)
    echo or edit this script to indicate the proper location of this file
    exit 1
fi

export SENDGRID_FROMEMAIL_NAME="Maryland Community Band"

case "$1" in
"dev")
    NODE_ENV=development node server/users-management.js
    ;;
"prod")
    NODE_ENV=production node server/users-management.js
    ;;
*)
    usage
    ;;
esac
