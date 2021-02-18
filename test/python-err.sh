#!/usr/bin/env bash

set -euo pipefail

./test/python-err.py 2>&1 | ./src/index.js
