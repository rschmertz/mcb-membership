#!/bin/bash

usage () {
cat <<EOF
Usage: $0 <csvfile>
EOF
}

if [ $# -lt 1 ]
then
    usage
    exit 1
fi
mongoimport --db usersmanagement-dev --collection users --type csv --headerline "$1"

