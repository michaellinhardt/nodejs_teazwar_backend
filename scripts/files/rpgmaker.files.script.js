/* eslint-disable brace-style */
/* eslint-disable max-len */
/* eslint-disable require-await */
/* eslint-disable max-statements-per-line */
const _ = require('lodash')
const { resolve } = require('path')
const { readdir } = require('fs').promises
const firstLower = str => str.charAt(0).toLowerCase() + str.substring(1)
const fs = require('fs-extra')

async function *getFiles (dir) {
  const dirents = await readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield* getFiles(res)
    } else {
      yield res
    }
  }
}

module.exports = async () => {
  await (async () => {
    const input = resolve(`${__dirname}/../input/mvdlc`)
    const inputArray = input.split('/')
    const globalId = inputArray[inputArray.length - 1]
    const outputFolder = resolve(`${__dirname}/../output/${globalId}`)
    try {
      //
      //
      //
      const files = []
      const importObject = {}

      const formatPart = part => {
        let partId = 0
        if (part.endsWith('1')) { partId = 1 }
        else if (part.endsWith('2')) { partId = 2 }
        else if (part.endsWith('3')) { partId = 3 }
        else if (part.endsWith('4')) { partId = 4 }
        else if (part.endsWith('5')) { partId = 5 }
        else if (part.endsWith('6')) { partId = 6 }
        else if (part.endsWith('7')) { partId = 7 }
        else if (part.endsWith('8')) { partId = 8 }
        else if (part.endsWith('9')) { partId = 9 }
        else if (part.endsWith('0')) { partId = 0 }

        const partFormt = part
          .replace('0', '')
          .replace('1', '')
          .replace('2', '')
          .replace('3', '')
          .replace('4', '')
          .replace('5', '')
          .replace('6', '')
          .replace('7', '')
          .replace('8', '')
          .replace('9', '')

        return { name: partFormt, id: partId }
      }

      const formatType = type => {
        if (type === 'Variation') { return 'ico' }
        if (type === 'TV') { return 'map' }
        if (type === 'SV') { return 'battle' }
        if (type === 'TVD') { return 'down' }
        if (type === 'Face') { return 'face' }
      }
      const formatGender = gender => gender.charAt(0).toLowerCase()

      const addFile = file => {
        const fileArray = file.replace(`${input}/`, '').split('/')
        const fileObject = {
          path: file,
          type: formatType(fileArray[0]),
          gender: formatGender(fileArray[1]),
          fileName: fileArray[2],
        }
        const fileNameArray = fileArray[2].split('_')
        fileNameArray.shift() // first is the file type, already gather from folder path

        const partRaw = firstLower(fileNameArray.shift())
        const partObject = formatPart(partRaw)
        fileObject.part = partObject.name
        fileObject.part_id = partObject.id

        const fileExtensionArray = fileNameArray[fileNameArray.length - 1].split('.')
        fileObject.extension = fileExtensionArray.pop()
        fileNameArray[fileNameArray.length - 1]
          = fileNameArray[fileNameArray.length - 1].split('.')[0]

        fileObject.originalId = fileNameArray.shift()

        while (fileNameArray.length) {
          const next = fileNameArray.shift()
          if (next.charAt(0) === 'c') {
            fileObject.color = `0${next.substring(1)}`
          } else if (next.charAt(0) === 'm') {
            fileObject.layer = next.substring(1)
          } else {
            console.debug(fileObject, next)
            process.exit(1)
          }
        }

        if (fileObject.color === '0') { fileObject.color = '01' }
        if (!fileObject.color) { fileObject.color = '00' }
        if (!fileObject.layer) { fileObject.layer = '000' }

        const { gender, type, originalId, part, color, layer, part_id } = fileObject

        const newID = `${gender}-${part}-${globalId}-${originalId}`
        fileObject.newName = `${gender}_${part}_${newID}_${type}_c${color}_l${layer}_${part_id}`

        files.push(fileObject)

        const fileFolder = `${gender}/${part}/${newID}`
        const objectPath = `${gender}.${part}.${newID}`

        const output = resolve(`${outputFolder}/${fileFolder}`)

        if (!fs.existsSync(output)) {
          fs.mkdirSync(output, { recursive: true })
        }

        const newPath = `${output}/${fileObject.newName}.${fileObject.extension}`

        fs.copySync(file, newPath)

        const importObjectDetails = {}
        const requireExpression = `[require::./${fileFolder}/${fileObject.newName}.${fileObject.extension}]`

        const fileColor = parseInt(color, 10)
        const fileLayer = parseInt(layer, 10)
        const fileId = part_id

        _.set(importObjectDetails, `colors[${fileId}][${fileColor}]`, requireExpression)
        _.set(importObjectDetails, `layers[${fileId}][${fileColor}]`, fileLayer)

        const mergeObject = _.set({}, objectPath, { [type]: importObjectDetails })
        _.merge(importObject, mergeObject)

        // console.log(fileObject)
        // if (newID === 'mvdlc-p1001' && part === 'beastEars') {
        //   console.log(fileObject)
        // }

      }

      await (async () => { for await (const f of getFiles(input)) { addFile(f) } })()

      const importFilePath = `${outputFolder}/ressources.flat.generator.js`
      const jsonString = (`export default ${JSON.stringify(importObject, null, 2)}`)
        .replaceAll('"[require::./', 'require(\'./')
        .replaceAll('.png]"', '.png\')')
      fs.writeFileSync(importFilePath, jsonString)

      const { execSync } = require('child_process')

      execSync(`eslint ${importFilePath} --fix`)

      const importObjectArray = {}
      const guide = {}
      const partList = []
      const genderList = []
      _.forEach(importObject, (genderObject, genderName) => {
        genderList.push(genderName)
        importObjectArray[genderName] = {}
        _.forEach(genderObject, (partObject, partName) => {

          importObjectArray[genderName][partName] = []
          _.forEach(partObject, (partItem, item_id) => {
            importObjectArray[genderName][partName].push({
              item_id,
              ...partItem,
            })
          })

          if (!guide[partName]) { partList.push(partName) }
          guide[partName] = true
        })
      })

      const importFileArrayPath = `${outputFolder}/ressources.array.generator.js`
      const jsonString2 = (`export default ${JSON.stringify(importObjectArray, null, 2)}`)
        .replaceAll('"[require::./', 'require(\'./')
        .replaceAll('.png]"', '.png\')')
      fs.writeFileSync(importFileArrayPath, jsonString2)

      execSync(`eslint ${importFileArrayPath} --fix`)

      const data
= `import _ from 'lodash'

const lists = {
  part: ${JSON.stringify(partList.sort(), null, 2)},
  gender: ${JSON.stringify(genderList.sort(), null, 2)},
}

lists.partIndex = {}
_.forEach(lists.part, (part, index) => { lists.partIndex[part] = index })

export default lists`

      const indexFilePath = `${outputFolder}/keys.generator.js`
      fs.writeFileSync(indexFilePath, data)

      execSync(`eslint ${indexFilePath} --fix`)

      //
      //
      //
    } catch (err) { console.error(err) }
  })()
}
