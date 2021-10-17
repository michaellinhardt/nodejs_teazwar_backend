const tmi = require('tmi.js')
const { language, twitch: { chatbot } } = require('../../config')

chatbot.tmiOpts.channels = [chatbot.channel]

module.exports = {
  getTwitch: () => {
    return new tmi.client(chatbot.tmiOpts)
  },

  buildSay: twitch => {
    const getLanguage = require('../files/language.helper').get
    return (message_key, ...args) => {
      const message = getLanguage(language.default, 'twitch', message_key, ...args)
      return twitch.say(chatbot.channel, message)
    }
  },

  connect: async twitch => {
    const sleep = require('../files/code.helper').sleep
    await sleep(100)
    await twitch.connect()
    await sleep(chatbot.sleepAfterConnect)
  },
}
