const { render } = require('prettyjson')
const h = require('../helpers')
const emitter = h.sockets.getServerEmitter()

let discord = null
let say = null
let socket = null

const backend = async (method, path, body = {}) => {
  const { payload } = await h.backend.runRouteTeazwar({ ...body, method, path })
  if (payload.emit) { emitter(...payload.emit) }
  if (payload.say) { say(...payload.say) }
}

const onSocketMessage = (socket, payload = {}) => {
  if (payload.emit) { emitter(...payload.emit) }
  if (payload.say) { say(...payload.say) }
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

  return socket
}
start()
