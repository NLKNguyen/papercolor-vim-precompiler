FROM nlknguyen/papercolor-vim-precompiler:base

MAINTAINER Nikyle Nguyen <NLKNguyen@MSN.com>

### CONFIG NPM when installing packages ###
# --no-bin-links by default
RUN npm config set bin-links false
# This is a common issue when running npm install in a Docker or Vagrant VM
# See: https://github.com/npm/npm/issues/9901

# Also, --no-optional by default
RUN npm config set optional false


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
