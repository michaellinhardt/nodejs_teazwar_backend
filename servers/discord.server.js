const Promise = require('bluebird')
const _ = require('lodash')
const { render } = require('prettyjson')
const h = require('../helpers')
const {
  discord: { teazyou_discord_user_id, sleepWhenBackendError }, backend: { log },
} = require('../config')
const emitter = h.sockets.getServerEmitter('discord.bot')

let discord = null
let say = null
let socket = null

const reportError = (error_location, error_message) =>
  say('debug_discord_report', error_location, error_message)

const commands = {}
h.discord.addToCommandsObject(commands, 'verifier')
// h.discord.addToCommandsObject(commands, 'quete')
// h.discord.addToCommandsObject(commands, 'commandes')

const clearBienvenueChannel = async () => {
  try {
    const messages = await h.discord.getChannelLastMessagesByName(discord, 'bienvenue', 100)
    if (messages.size <= 1) { return true }
    await Promise.map(messages, async messageArr => {
      const message = messageArr[1]
      const author_id = message.author.id
      if (author_id !== teazyou_discord_user_id) { await message.delete() }
    }, { concurrency: 99 })
    return clearBienvenueChannel()

  } catch (err) {
    console.error(err)
    reportError('discord_clear_bienvenue', err.message)
  }
}

const payloadReply = async (payload) => {
  const interaction = _.get(payload, 'big_data.interaction', undefined)
  if (!interaction) { return false }

  const isEphemeral = _.get(payload, 'isEphemeral', true)
  const reply = _.get(payload, 'reply', ['unknow'])
  const replyArray = Array.isArray(reply[0]) ? reply : [reply]

  let index = -1
  await Promise.map(replyArray, async replyOne => {

    if (replyOne[0] === 'command_verify_otp') {

      const { MessageActionRow, MessageButton } = require('discord.js')
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setLabel('Go to TeazYou twitch tchat')
            .setURL('https://www.twitch.tv/popout/teazyou/chat')
            .setStyle('LINK'),
        )

      const content = h.discord.getLang(...replyOne)
      await interaction.reply({ content, ephemeral: true, components: [row] })

    } else {
      await h.discord.replyInteraction((index += 1), interaction, isEphemeral, ...replyOne)

    }
    await h.code.sleep(50)
  }, { concurrency: 1 })
}

const backend = async (method, path, body = {}) => {
  try {
    _.set(body, 'big_data.redis', h.redis)
    const { payload } = await h.backend.runRouteTeazwar({ ...body, method, path })
    executePayloadOrder(payload)

  } catch (err) {
    console.error(err)
    const error_location = `discord${path.split('/').join('..')}`
    reportError(error_location, err.message)
    await h.code.sleep(sleepWhenBackendError)
  }
}

const onSocketMessage = (socket, payload) => {
  try {
    if (log) {
      console.info(`Received from: ${socket.id}\n`, render(payload))
    }
    executePayloadOrder(payload)

  } catch (err) {
    console.error(err)
    reportError('discord_socket_message', err.message)
  }
}

const executePayloadOrder = async payload => {
  const isSayArrays = _.get(payload, 'say.discord', undefined)
  if (isSayArrays !== undefined) {
    await Promise.each(isSayArrays, sayArray => sayArray.length ? say(...sayArray) : true,
      { concurrency: 1 })
    delete payload.say.discord
  }
  await payloadReply(payload)
  await h.sockets.dispatchSayOrder(payload, emitter)
}

const start = async () => {
  h.redis.connect('discord.bot')
  discord = h.discord.getDiscord()
  await h.discord.connect(discord)
  say = await h.discord.buildSay(discord)

  await say('server_welcome')
  await say('game_welcome')
  await say('stream_welcome')
  await say('stats_welcome')
  await say('spam_welcome')
  await say('debug_welcome')

  socket = h.sockets.openInfraSocket('discord', {
    onSocketConnect: (socket) => socket,
    onSocketDisconnect: (socket) => socket,
    onSocketError: (socket) => socket,
    onSocketMessage,
    backend,
  })

  await h.discord.registerCommands(commands, say)
  await h.discord.onInteractionCommand(commands, discord, backend)

  h.discord.onDiscordMessage(discord, backend)

  clearBienvenueChannel()

  return socket
}

start()
