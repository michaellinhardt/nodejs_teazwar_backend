const Promise = require('bluebird')
const { render } = require('prettyjson')
const _ = require('lodash')
const h = require('../helpers')
const emitter = h.sockets.getServerEmitter('twitch.bot')
const { backend: { log }, cron: { itvSayTwitch, itvNothingTosay } } = require('../config')

let twitch = null
let say = null
let socket = null

const executePayloadOrder = async payload => {
  const isSayArrays = _.get(payload, 'say.twitch', undefined)
  if (isSayArrays !== undefined) {
    await Promise.each(isSayArrays, sayArray => sayArray.length ? say(...sayArray) : true,
      { concurrency: 1 })
    delete payload.say.twitch
  }
  await h.sockets.dispatchSayOrder(payload, emitter)
}

const backend = async (method, path, body = {}) => {
  try {
    _.set(body, 'big_data.redis', h.redis)
    const { payload } = await h.backend.runRouteTeazwar({ ...body, method, path })
    executePayloadOrder(payload)

  } catch (err) {
    console.error(err)
    const error_location = `discord${path.split('/').join('..')}`
    const { payload = {} } = await h.backend
      .discordReportError(error_location, err.message)
    executePayloadOrder(payload)
  }

}

const onSocketMessage = async (socket, payload) => {
  try {
    if (log) {
      console.info(`Received from: ${socket.id}\n`, render(payload))
    }
    executePayloadOrder(payload)

  } catch (err) {
    console.error(err)
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

const sayLoop = async () => {
  let isSay = true
  try {
    isSay = await h.twitch.executeSay(twitch)

  } catch (err) {
    console.debug('error in sayLoop', err.message)
  }
  const interval = isSay ? itvSayTwitch : itvNothingTosay
  setTimeout(sayLoop, interval)
}

const start_twitch = async () => {
  h.redis.connect('twitch.bot')
  twitch = h.twitch.getTwitch()
  say = h.twitch.buildSay(twitch)
  listen_events(twitch)
  await h.twitch.connect(twitch)

  // say('welcome')

  socket = h.sockets.openInfraSocket('twitch', {
    onSocketConnect: (socket) => socket,
    onSocketDisconnect: (socket) => socket,
    onSocketError: (socket) => socket,
    onSocketMessage,
    backend,
  })

  sayLoop()

  return socket
}

start_twitch()

module.exports = start_twitch
