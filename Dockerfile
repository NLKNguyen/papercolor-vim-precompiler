FROM nlknguyen/papercolor-vim-precompiler:base

MAINTAINER Nikyle Nguyen <NLKNguyen@MSN.com>

RUN sudo apk add --no-cache vim

#### BUILD ####
WORKDIR /usr/src/app

# add dependencies first, which don't change so often, to leverage image caching
COPY package.json .
RUN npm install --production

# add the rest of the source files; might copy package.json again but no big deal
COPY . .
#    ^ filter by .dockerignore


#### READY TO USE ####

# Start working at the mounted directory
WORKDIR /mnt

ENTRYPOINT ["/usr/src/app/run.sh"]
CMD ["--compile"]

# CMD ["/usr/src/app/main.sh", "--compile"]
