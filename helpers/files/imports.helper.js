const _ = require('lodash')
const requireDirectory = require('require-directory')

module.exports = {

  importByFilename: (path, extention, accumulator = {}) => {

    const firstCharUpper = string => {
      const lowered = string.toLowerCase()
      return lowered.charAt(0).toUpperCase() + lowered.slice(1)
    }

    const camelCaseFileName = filename => {
      const nameSplit = filename.split('.')
      const firstName = nameSplit.shift()
      const lastName = nameSplit
        .map(n => firstCharUpper(n))
        .join('')
      return `${firstName}${lastName}`
    }

    _.forEach(requireDirectory(module, path), (fileContent, fileName) => {
      const contentName = fileName.replace(extention, '')

      const camelCaseName = camelCaseFileName(contentName)

      accumulator[camelCaseName] = fileContent
    }, {})

    return accumulator
  },

  importDefaultByFilename: (path, extention, accumulator = {}) => {

    const firstCharUpper = string => {
      const lowered = string.toLowerCase()
      return lowered.charAt(0).toUpperCase() + lowered.slice(1)
    }

    const camelCaseFileName = filename => {
      const nameSplit = filename.split('.')
      const firstName = nameSplit.shift()
      const lastName = nameSplit
        .map(n => firstCharUpper(n))
        .join('')
      return `${firstName}${lastName}`
    }

    _.forEach(requireDirectory(module, path), (fileContent, fileName) => {
      const contentName = fileName.replace(extention, '')

      const camelCaseName = camelCaseFileName(contentName)

      accumulator[camelCaseName] = fileContent.default
    }, {})

    return accumulator
  },

  importMerged: (path, accumulator = {}) => {
    _.forEach(requireDirectory(module, path), fileContent => {
      accumulator = {
        ...accumulator,
        ...fileContent,
      }
    }, {})
    return accumulator
  },

  importDefaultMerged: (path, accumulator = {}) => {
    _.forEach(requireDirectory(module, path), fileContent => {
      accumulator = {
        ...accumulator,
        ...fileContent.default,
      }
    }, {})
    return accumulator
  },

}

