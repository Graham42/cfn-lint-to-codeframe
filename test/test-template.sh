#!/usr/bin/env bash

template="$1"
if [ -z "$template" ]; then
  echo "Missing template parameter" >&2
  exit 1
fi

parseable_output=$(cfn-lint -t "${template}" -f parseable)
if [ -n "$DEBUG" ]; then
  echo "$parseable_output" | ./src/index.js
fi
echo "$parseable_output" | ./src/index.js >/dev/null
if [ $? -ne 0 ]; then
  echo "Error with $template"
  exit 1
fi
