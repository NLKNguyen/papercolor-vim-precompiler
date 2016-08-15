FROM alpine:3.4
# In case the main package repositories are down, use the alternative:
# FROM gliderlabs/alpine:3.4

MAINTAINER Nikyle Nguyen <NLKNguyen@MSN.com>

ARG REQUIRED_PACKAGES="sudo nodejs git wget rsync zip"
RUN apk update && apk upgrade \
      && apk add --no-cache ${REQUIRED_PACKAGES}

#### DEFAULT USER ####
ARG USER=alpine
ENV USER ${USER}
RUN adduser -D ${USER} \
      && echo "${USER}   ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers 


### CONFIG NPM when installing packages ###
# --no-bin-links by default
RUN npm config set bin-links false
# This is a common issue when running npm install in a Docker or Vagrant VM
# See: https://github.com/npm/npm/issues/9901

# Also --no-optional by default
RUN npm config set optional false

#### APP DIRECTORY ####
RUN mkdir -p /usr/src/app

USER ${USER}

#### BUILD ####
ONBUILD WORKDIR /usr/src/app
ONBUILD COPY package.json .
ONBUILD RUN npm install
ONBUILD COPY . /usr/src/app
