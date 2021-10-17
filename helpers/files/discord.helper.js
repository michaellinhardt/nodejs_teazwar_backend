import * as Promise from 'bluebird'
const Discord = require('discord.js')
const { language, discord: { token, chatbot } } = require('../../config')

module.exports = {

  getDiscord: () => {
    const intents = [Discord.Intents.FLAGS.GUILDS]
    return new Discord.Client({ intents })
  },

  connect: async discord => {
    const sleep = require('../files/code.helper').sleep
    await sleep(100)
    await discord.login(token)
    await sleep(chatbot.sleepAfterConnect)
  },

  buildSay: async discord => {
    const getLanguage = require('../files/language.helper').get
    await Promise.each(chatbot.channels, async channelArr => {
      const [name, id] = channelArr
      const channel = await discord.channels.cache.get(id)
      discord[`_${name}`] = channel
      discord[`_${name}`].say = (msg) => channel.send(msg)
    }, { concurrency: 3 })

    return (message_key, ...args) => {
      const channel = (message_key.split('_'))[0]
      const message = getLanguage(language.default, 'discord', message_key, ...args)
      discord[`_${channel}`].say(message)
    }
  },

}
