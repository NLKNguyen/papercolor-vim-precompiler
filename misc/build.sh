#!/bin/sh
#
# to be run from the project root:
#   $ misc/build.sh
#
# or in case the temporary alias is desirable:
#   $ source misc/build.sh

options=$1
# shellcheck disable=SC2086
docker build ${options} -t nlknguyen/papercolor-vim-precompiler:latest .
alias app='docker run --rm -it -v $(pwd):/mnt nlknguyen/papercolor-vim-precompiler:latest'
