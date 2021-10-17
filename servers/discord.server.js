const Promise = require('bluebird')
const { render } = require('prettyjson')
const h = require('../helpers')
const emitter = h.sockets.getServerEmitter()

let discord = null
let say = null
let socket = null

const commands = {
  verifier: 'Génére un code de vérification à copier sur le tchat de twitch pour devenir membre',
  quete: 'Obtiens des bonus d\'xp et de loot en réalisant cette quête journaliére',
  commands: 'Affiche la liste des commandes du server',
}

const payloadReply = async (interaction, isEphemeral, replys) => {
  const replyArray = Array.isArray(replys[0]) ? replys : [replys]

  let index = -1
  await Promise.each(replyArray, async replyOne => {
    await h.discord.replyInteraction((index += 1), interaction, isEphemeral, ...replyOne)
    await h.code.sleep(50)
  }, { concurrency: 1 })
}
const payloadEmit = async (emits) => {
  const emitArray = Array.isArray(emits[0]) ? emits : [emits]
  await Promise.each(emitArray, async emitOne => {
    await emitter(...emitOne)
    await h.code.sleep(200)
  }, { concurrency: 1 })
}
const payloadSay = async (says) => {
  const sayArray = Array.isArray(says[0]) ? says : [says]
  await Promise.each(sayArray, async sayOne => {
    await say(...sayOne)
    await h.code.sleep(200)
  }, { concurrency: 1 })
}

const backend = async (method, path, body = {}) => {
  const { payload } = await h.backend.runRouteTeazwar({ ...body, method, path })
  if (payload.emit) { payloadEmit(payload.emit) }
  if (payload.say) { payloadSay(payload.say) }
  if (payload.reply && payload.interaction) {
    payloadReply(payload.interaction, !!payload.ephemeral, payload.reply)
  }
}

const onDiscordMessage = message => {
  console.debug(message.channel)
}

const onSocketMessage = (socket, payload = {}) => {
  if (payload.emit) { payloadEmit(payload.emit) }
  if (payload.say) { payloadSay(payload.say) }
  if (payload.reply && payload.interaction) {
    payloadReply(payload.interaction, !!payload.ephemeral, payload.reply)
  }
  console.debug(`Received from: ${socket.id}\n`, render(payload))
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

  h.discord.onDiscordMessage(discord, onDiscordMessage)

  return socket
}
start()
