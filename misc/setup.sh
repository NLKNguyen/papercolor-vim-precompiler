#!/bin/sh
#
# to be run from the project root:
#   $ misc/setup.sh
#
# or in case the temporary alias is desirable:
#   $ source misc/setup.sh

docker build -t nlknguyen/papercolor-vim-precompiler:base base/

docker build -t nlknguyen/papercolor-vim-precompiler:dev dev/
alias @='docker run --rm -it -v $(pwd):/mnt nlknguyen/papercolor-vim-precompiler:dev'

alias shellcheck='docker run --rm -it -v $(pwd):/mnt nlknguyen/alpine-shellcheck'
shellcheck --version
