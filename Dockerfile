FROM nlknguyen/papercolor-vim-precompiler:onbuild

WORKDIR /mnt

CMD ["node", "/usr/src/app/compile.js"]
