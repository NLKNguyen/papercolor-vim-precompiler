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

const path = require('path')
const YAML = require('yamljs')
const _ = require('lodash')
const fs = require('fs')


function compile_all_themes () {
  const themes = YAML.load('highlightings.yml')

  _.forOwn(themes, (theme, name) => {
    const prefix = 'papercolor-'
    const theme_name = `${prefix}${name}`
    const model = build_model(theme, theme_name)
    const view = path.join(__dirname, 'template', 'theme.template')
    const output = render(model, view)
    save(output, `./${theme_name}.vim`)
  });
}


function build_model (theme, name) {
  const high_color = theme['high-color']
  const low_color = theme['low-color']
  const model = {
    'theme_name': name,
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
  
  return model
}

/**
 * Convert json object of highlighting rules to VimL highlighting commands
 * 
 * @param {JSON} highlighting_groups the object contains highlighting rules for syntax groups
 */
function convert_object_to_vim_commands (highlighting_groups) {
  const result = ['']
  // Plain highlight commands: no linking
  _.forOwn(highlighting_groups, (highlighting, group) => {
    result.push(`hi ${group} ${highlighting}`)
  })
  
  // TODO: The following strategy helps reduce the compiled file about 40% by using highlight linking,
  // but it produces some inconsistencies on the syntax highlighting when loaded in Vim
  // 
  // const keyOfPair = (e) => e[0]
  // const valueOfPair = (e) => e[1]
  
  // const grouped_highlighting_groups = _(highlighting_groups) // from : { k1: v1, k2: v2, ... }
  //                                     .toPairs()             // to   : [ [k1, v1], [k2, v2], ... ]
  //                                     .groupBy(valueOfPair)  // then : { v1 : [ [k1, v1], [k5, v1], .. ], v2 : [ [k2, v2], [k4, v2], .. ], ... }
  //                                     .mapValues(arr => _.map(arr, keyOfPair)) // finally : { v1 : [k1, k5, ..], v2 : [ k2, k4, ..], ... }
  //                                     .value()
  
  // // console.log(grouped_highlighting_groups)
  // let groupId = 0
  // let groupName = '_'
  // _.forEach(grouped_highlighting_groups, (groups, highlighting) => {

  //     // const groupName = _.head(groups)
  //     // const hidef = `hi ${groupName} ${highlighting}`
  //     // result.push(hidef)
  //     // _.forEach(_.tail(groups), (group, idx) => { 
  //     //   const hilink = `hi! link ${group} ${groupName}`
  //     //   result.push(hilink)
  //     // })


  //   if (groups.length == 1) {
  //     const group = groups[0]
  //     result.push(`hi ${group} ${highlighting}`)
  //   } else {
  //     // set groupName as a single alphabet to reduce characters
  //     // groupId number from 0 to 51 will have equivalent alphabet A to z
  //     // beyond that, use hex number with underscore prefix to avoid leading number
  //     if (groupId <= 25) {
  //       groupName = `_${String.fromCharCode(65 + groupId)}` // A-Z
  //     } else if (groupId > 25 && groupId <= 51) {
  //       groupName = `_${String.fromCharCode(97 + (groupId - 26))}` // a-z
  //     } else {
  //       groupName = `_${(groupId).toString(16)}`
  //     }

  //     const hidef = `hi ${groupName} ${highlighting}`
  //     result.push(hidef)
  //     _.forEach(groups, (group, idx) => { 
  //       const hilink = `hi! link ${group} ${groupName}`
  //       const hidecl = `hi ${group} ${highlighting}`       
  //       result.push( (hilink.length < hidecl.length) ? hilink : hidecl)   
  //     })

  //     groupId++
  //   }

  // })


  return result.join('\n')
}



function render (model, view) {
  const src = fs.readFileSync(view, 'utf8')
  const compiled = _.template(src)
  const output = compiled(model)
  return output
}


function save (output, outputDest) {
  const file = fs.createWriteStream(outputDest, { flags: 'w'} ) // create new or overwrite existing file
  file.on('error', (err) => { console.log(`Error generating ${outputDest}`) })
  file.write(output, () => { console.log(`=> ${outputDest}`) })
  file.end()
};

compile_all_themes()