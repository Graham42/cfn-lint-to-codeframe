#!/usr/bin/env bash

# By running
#
#   git clone https://github.com/aws-cloudformation/cfn-python-lint.git
#   find cfn-python-lint/test/fixtures/templates/ -name '*.yaml' -print0 | xargs -0 -P 8 -I{} ./test.sh {}
#   find cfn-python-lint/test/fixtures/templates/ -name '*.json' -print0 | xargs -0 -P 8 -I{} ./test.sh {}
#
# we can find templates that would cause issues.

template="$1"
input=$(cfn-lint -t "${template}" -f parseable)
echo "$input" | ./src/index.js >/dev/null
if [ $? -ne 0 ]; then
  echo "Error with $template"
fi
