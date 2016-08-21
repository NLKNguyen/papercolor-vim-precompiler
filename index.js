'use strict'
/**
 * papercolor-vim-precompiler
 * https://github.com/NLKNguyen/papercolor-vim-precompiler
 *
 * Precompile papercolor-theme.vim framework to blazingly fast, stand-alone vim color schemes
 *
 * Author: Nikyle Nguyen <NLKNguyen@MSN.com>
 * License: MIT 2016
 */

const YAML = require('yamljs')
const _ = require('lodash')
const fs = require('fs')

// const highlights = YAML.load('vim-highlights.yaml');
