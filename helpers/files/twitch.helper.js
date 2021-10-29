const tmi = require('tmi.js')
const { language, twitch: { chatbot } } = require('../../config')

chatbot.tmiOpts.channels = [chatbot.channel]

const sayArray = []
let lastMessage

module.exports = {
  getTwitch: () => {
    return new tmi.client(chatbot.tmiOpts)
  },

  buildSay: () => {
    const getLanguage = require('../files/language.helper').get
    return (message_key, ...args) => {
      const message = getLanguage(language.default, 'twitch', message_key, ...args)
      sayArray.push(message)
    }
  },

  executeSay: async twitch => {
    if (!sayArray.length) { return false }
    const message = sayArray.shift()

    if (lastMessage === message) { return false }

    lastMessage = message
    await twitch.say(chatbot.channel, message)
    return true
  },

  connect: async twitch => {
    const sleep = require('../files/code.helper').sleep
    try {
      await sleep(100)
      await twitch.connect()
      await sleep(chatbot.sleepAfterConnect)
      return true

    } catch (err) { return false }
  },
}
