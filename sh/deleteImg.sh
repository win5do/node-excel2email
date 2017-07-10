#!/usr/bin/env bash

find ./uploads/* -type d  -ctime +7 -exec rm -r {} \;


# crontab -e
# * * * * 0 root sh /sh/delete-img.sh