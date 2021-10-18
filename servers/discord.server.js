const Promise = require('bluebird')
const _ = require('lodash')
const { render } = require('prettyjson')
const h = require('../helpers')
const { discord: { bienvenue_message_id } } = require('../config')
const emitter = h.sockets.getServerEmitter()

let discord = null
let say = null
let socket = null

const commands = {}
h.discord.addToCommandsObject(commands, 'verifier')
// h.discord.addToCommandsObject(commands, 'quete')
// h.discord.addToCommandsObject(commands, 'commandes')

const clearBienvenueChannel = async () => {
  const messages = await h.discord.getChannelLastMessagesByName(discord, 'bienvenue', 100)
  if (messages.size <= 1) { return true }
  await Promise.each(messages, async messageArr => {
    const message_id = messageArr[0]
    const message = messageArr[1]
    if (message_id !== bienvenue_message_id) { await message.delete() }
  }, { concurrency: 5 })
  return clearBienvenueChannel()
}

const payloadReply = async (payload) => {
  const interaction = _.get(payload, 'big_data.interaction', undefined)
  if (!interaction) { return false }

  const isEphemeral = _.get(payload, 'isEphemeral', true)
  const reply = _.get(payload, 'reply', ['unknow'])
  const replyArray = Array.isArray(reply[0]) ? reply : [reply]

  let index = -1
  await Promise.each(replyArray, async replyOne => {

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
  const { payload } = await h.backend.runRouteTeazwar({ ...body, method, path })
  executePayloadOrder(payload)
}

const onSocketMessage = (socket, payload) => {
  executePayloadOrder(payload)
  console.debug(`Received from: ${socket.id}\n`, render(payload))
}

const executePayloadOrder = payload => {
  if (!payload || typeof (payload) !== 'object') { return true }

  const executeSequence = async (method, contents) => {
    const contentArray = Array.isArray(contents[0]) ? contents : [contents]
    await Promise.each(contentArray, async content => {
      await method(...content)
      await h.code.sleep(100)
    }, { concurrency: 1 })
  }

  if (payload.emit) { executeSequence(emitter, payload.emit) }
  if (payload.say) { executeSequence(say, payload.say) }
  if (payload.reply) { payloadReply(payload) }
}

const start = async () => {
  discord = h.discord.getDiscord()
  await h.discord.connect(discord)
  say = await h.discord.buildSay(discord)

  await say('server_welcome')
  await say('game_welcome')
  await say('stream_welcome')
  await say('stats_welcome')

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
