const _ = require('lodash')
const language = require('../../languages')

const replacer = (message, ...args) => {
  let msg = message
  _.forEach(args, (value, index) => {
    msg = msg.replace(`[${index}]`, value)
  })
  return msg
}

const extractMessage = (lang, language_file, language_key) => {
  const message = _.get(language, `${lang}.${language_file}.${language_key}`, language_key)
  return typeof (message) === 'object' && Array.isArray(message)
    ? _.sample(message) : message
}

module.exports = {

  get: (lang, language_file, language_key, ...language_args) => {
    const message = extractMessage(lang, language_file, language_key)
    return replacer(message, ...language_args)
  },

}
