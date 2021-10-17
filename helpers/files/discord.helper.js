import * as Promise from 'bluebird'
import _ from 'lodash'
const Discord = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes: { applicationGuildCommands } } = require('discord-api-types/v9')

const { language, discord: { token, guildId, clientId, chatbot } } = require('../../config')
const getLanguage = require('../files/language.helper').get

module.exports = {

  getDiscord: () => {
    const intents = [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]
    return new Discord.Client({ intents })
  },

  connect: async discord => {
    const sleep = require('../files/code.helper').sleep
    await sleep(100)
    await discord.login(token)
    await sleep(chatbot.sleepAfterConnect)
  },

  buildSay: async discord => {
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

  replyInteraction: (index = 0, interaction, ephemeral, message_key, ...args) => {
    const content = getLanguage(language.default, 'discord', message_key, ...args)
    const method = index === 0 ? 'reply' : 'followUp'
    interaction[method]({ content, ephemeral })
  },

  registerCommands: async (commands, say) => {
    const commandsArr = []
    const buildCommandJSON = (name, description) =>
      (new SlashCommandBuilder().setName(name).setDescription(description)).toJSON()
    _.forEach(commands, (description, name) =>
      commandsArr.push(buildCommandJSON(name, description)))

    const rest = new REST({ version: '9' }).setToken(token)

    await say('server_discordbot_slashcommandRegisteredStart')
    await rest.put(applicationGuildCommands(clientId, guildId), { body: commandsArr })
      .catch(console.error)
    await say('server_discordbot_slashcommandRegisteredEnd')
  },

  onInteractionCommand: (commands, discord, backend) => {
    discord.on('interactionCreate', interaction => {

      const { commandName } = interaction
      const command_name = commandName.toLowerCase()
      if (!commands[command_name]) { return }

      const body = { interaction }

      return backend('post', `/discord/command/${command_name}`, body)
    })
  },

  onDiscordMessage: (discord, callback) => discord.on('messageCreate', callback),

}
