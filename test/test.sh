#!/usr/bin/env bash

set -e -o pipefail

find test/ -name '*.yaml' -o -name '*.json' -print0 | xargs -0 -L1 -I{} ./test/test-template.sh {}

if [ -n "$DEBUG" ]; then
  ./test/test-python-err.sh
fi
