const _ = require('lodash')
const language = require('../../languages')

const replacer = (language_file, message, ...args) => {
  let msg = message
  _.forEach(args, value => {

    if (language_file !== 'discord') {
      msg = msg.replace('[?]', value)

    } else {
      const boldReplacer = `**${value}**`

      const bold = msg.indexOf('[?]')
      const noBold = msg.indexOf('[.?]')

      if (noBold === -1 || (bold !== -1 && bold < noBold)) {
        msg = msg.replace('[?]', boldReplacer)
      } else {
        msg = msg.replace('[.?]', value)
      }
    }
  })
  return msg
}

const extractMessage = (lang, language_file, language_key) => {
  const message = _.get(language, `${lang}.${language_file}.${language_key}`, language_key)
  return typeof (message) === 'object' && Array.isArray(message)
    ? _.sample(message) : message
}

module.exports = {

  userTwitchLevlUp: ({ display_name, level }) => `=[ @${display_name} ${level} ]=`,
  userDiscordLevlUp: ({ discord_id, display_name, level }) =>
    `=[ ${(discord_id ? `<@${discord_id}> ` : '')}${display_name} ${level} ]=`,
  userDiscordPing: (user = {}) => user && user.discord_id ? ` <@${user.discord_id}> ` : '',

  get: (lang, language_file, language_key, ...language_args) => {
    const message = extractMessage(lang, language_file, language_key)
    return replacer(language_file, message, ...language_args)
  },

}
