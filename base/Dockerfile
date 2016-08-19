FROM alpine:3.4
# In case the main package repositories are down, use the alternative:
# FROM gliderlabs/alpine:3.4

MAINTAINER Nikyle Nguyen <NLKNguyen@MSN.com>

ARG REQUIRED_PACKAGES="sudo nodejs vim"
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

#### SWITCH TO DEFAULT USER  ####
USER ${USER}
