'use strict'
/**
 * papercolor-vim-precompiler
 *
 * Precompile papercolor-theme.vim framework to blazingly fast, stand-alone vim color schemes
 *
 * @author: Nikyle Nguyen <NLKNguyen@MSN.com>
 * @license: MIT 2016
 * @see: https://github.com/NLKNguyen/papercolor-vim-precompiler
 */

const YAML = require('yamljs')
const _ = require('lodash')
const fs = require('fs')

/**
 * Convert json object of highlighting rules to VimL highlighting commands
 * 
 * @param {JSON} highlighting_groups the object contains highlighting rules for syntax groups
 */
function convert_object_to_vim_commands (highlighting_groups) {
  const result = ['']
  _.forOwn(highlighting_groups, (group, highlighting) => {
    result.push(`hi {group} {highlighting}`)
  })
  return result.join('\n')
}


function compile_all_themes () {
  const themes = YAML.load('highlightings.yml')

  _.forOwn(themes, (theme, name) => {
    compile_theme(theme, name)
  });
}

function compile_theme (theme, name) {
  const high_color = theme['high-color']
  const low_color = theme['low-color']
  const theme_name = `papercolor-{name}`
  const model = {
    theme_name,
    'high_color' : {},
    'low_color' : {}
  }

  // high-color can have light, dark, or both variants.
  if (_.has(high_color, 'light'))
    model.high_color.light_highlightings = convert_object_to_vim_commands(high_color['light'])

  if (_.has(high_color, 'dark'))
    model.high_color.dark_highlightings = convert_object_to_vim_commands(high_color['dark'])

  // low-color only has either light or dark, which doesn't have meaningful difference.
  if (_.has(low_color, 'light'))
    model.low_color.highlightings = convert_object_to_vim_commands(low_color['light'])
  else
    model.low_color.highlightings = convert_object_to_vim_commands(low_color['dark'])
  
  save_model_to_file ('template/theme.template', model, `./{theme_name}.vim`)
}

function save_model_to_file (templateSrc, model, outputDest) {
  const src = fs.readFileSync(templateSrc, 'utf8')
  const compiled = _.template(src)
  const output = compiled(model)

  const file = fs.createWriteStream(outputDest, { flags: 'w'} ) // create new or overwrite existing file
  file.on('error', (err) => { console.log(`Error generating ${outputDest}`) })
  file.write(output, () => { console.log(`Generated ${outputDest}`) })
  file.end()
};

compile_all_themes()