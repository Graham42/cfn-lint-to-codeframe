#!/usr/bin/env bash

set -e

./test/python-err.py 2>&1 | ./src/index.js > /dev/null
if [ $? -ne 0 ]; then
  echo "Error with handling python error" >&2
  exit 1
fi
