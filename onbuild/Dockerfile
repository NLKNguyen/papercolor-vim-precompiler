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

#### CREATE APP DIRECTORY FOR USER ####
RUN mkdir -p /usr/src/app
RUN chown -R ${USER} /usr/src/app

#### WORK AS NON-ROOT USER  ####
USER ${USER}

### CONFIG NPM when installing packages ###
# --no-bin-links by default
RUN npm config set bin-links false
# This is a common issue when running npm install in a Docker or Vagrant VM
# See: https://github.com/npm/npm/issues/9901

# Also, --no-optional by default
RUN npm config set optional false


#### BUILD ####
ONBUILD WORKDIR /usr/src/app

# add dependencies first, which don't change so often, to leverage image caching
ONBUILD COPY package.json .
ONBUILD RUN npm install --production

# add the rest of the source files; might copy package.json again but no big deal
ONBUILD COPY . .
#            ^ filter by .dockerignore
