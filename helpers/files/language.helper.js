const _ = require('lodash')
const defaultLanguage = require('../../config/files/language.config').default
const language = require('../../languages')

const replacer = (message, ...args) => {
  let msg = message
  _.forEach(args, (value, index) => {
    msg = msg.replace(`[${index}]`, value)
  })
  return msg
}

module.exports = {

  get: (language_key, ...language_args) => {
    const message = _.get(language, language_key, language_key)
    return replacer(message, ...language_args)
  },

}
