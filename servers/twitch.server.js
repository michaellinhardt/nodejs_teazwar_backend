const { render } = require('prettyjson')
const h = require('../helpers')
const emitter = h.sockets.getServerEmitter()

let twitch = null
let say = null
let socket = null

const backend = async (method, path, body = {}) => {
  const { payload } = await h.backend.runRouteTeazwar({ ...body, method, path, })
  if (payload.emit) { emitter(...payload.emit) }
  if (payload.say) { say(...payload.say) }
}

const onSocketMessage = (socket, payload) => {
  if (payload.emit) { emitter(...payload.emit) }
  if (payload.say) { say(...payload.say) }
  console.debug(`Received from: ${socket.id}\n`, render(payload))
}

const listen_events = twitch => {
  twitch.on('chat', (channel, userstate, msg, self) =>
    backend('post', '/twitch/chat', { channel, userstate, msg, self }))

  twitch.on('connected', (address, port) =>
    backend('post', '/twitch/connected', { address, port }))

  twitch.on('join', (channel, username, self) =>
    backend('post', '/twitch/join', { channel, username, self }))

  twitch.on('part', (channel, username, self) =>
    backend('post', '/twitch/part', { channel, username, self }))
}

const start = async () => {
  twitch = h.twitch.getTwitch()
  say = h.twitch.buildSay(twitch)
  listen_events(twitch)
  await h.twitch.connect(twitch)

  say('welcome')

  socket = h.sockets.openInfraSocket('twitch', {
    onSocketConnect: (socket) => socket,
    onSocketDisconnect: (socket) => socket,
    onSocketError: (socket) => socket,
    onSocketMessage,
    backend,
  })
}

start()