const Promise = require('bluebird')
const _ = require('lodash')
const h = require('../helpers')
const emitter = h.sockets.getServerEmitter()

let twitch = null
let say = null
let socket = null

const executePayloadOrder = async payload => {
  if (!payload || typeof (payload) !== 'object') { return true }

  const executeSequence = (method, contents) => !contents.length ? true
    : Promise.each(contents, content => content.length ? method(...content) : true,
      { concurrency: 1 })

  await executeSequence(say, _.get(payload, 'say.twitch', []))
  await executeSequence(emitter, [[
    _.get(payload, 'socketIds.discord', null),
    { say: { discord: _.get(payload, 'say.discord', []) } },
  ]])

}

const backend = async (method, path, body = {}) => {
  try {
    const { payload } = await h.backend.runRouteTeazwar({ ...body, method, path })
    executePayloadOrder(payload)

  } catch (err) {
    console.debug(err)
    const error_location = `discord${path.split('/').join('..')}`
    const { payload = {} } = await h.backend
      .discordReportError(error_location, err.message)
    executePayloadOrder(payload)
  }

}

const onSocketMessage = async (socket, payload) => {
  try {
    executePayloadOrder(payload)

  } catch (err) {
    console.debug(err)
    const { payload = {} } = await h.backend
      .discordReportError('twitch_socket_message', err.message)
    executePayloadOrder(payload)
  }
}

const listen_events = twitch => {
  twitch.on('chat', (channel, userstate, msg, self) => {
    const isCommand = msg.startsWith('!')
    const body = { channel, userstate, msg, self }
    if (isCommand) { body.command = ((msg.split(' '))[0]).replace('!', '').toLowerCase() }
    const link = isCommand ? `/twitch/command/${body.command}` : '/twitch/chat'
    backend('post', link, body)
  })

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

  return socket
}

start()
