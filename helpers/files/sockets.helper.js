const Promise = require('bluebird')
const _ = require('lodash')
const { io } = require('socket.io-client')
const { backend, jwt: { teazwarToken } } = require('../../config')
const socketUrl = `${backend.uri}:${backend.socketPort}`

const { Server } = require('socket.io')
const { createAdapter } = require('@socket.io/redis-adapter')
const { Emitter } = require('@socket.io/redis-emitter')
const { createClient } = require('redis')

let emitterHandler = null

const dispatchSayOrder = async (payload, emitterAddr = 'unknow') => {

  if (!payload
    || typeof (payload) !== 'object'
    || !payload.say) {
    return true
  }
  const emitter = typeof (emitterAddr) !== 'string' ? emitterAddr : getServerEmitter(emitterAddr)

  const executeSequence = contents => !contents.length ? true
    : Promise.each(contents, content => content.length ? emitter(...content) : true,
      { concurrency: 1 })

  const infraNames = []
  _.forEach(payload.say, (sayArrays, infra_name) => infraNames.push(infra_name))

  await Promise.map(infraNames, async (infra_name) => {
    const sayArrays = _.get(payload, `say.${infra_name}`, [])
    if (sayArrays.length) {
      await executeSequence([[infra_name,
        { say: { [infra_name]: _.get(payload, `say[${infra_name}]`, []) } },
      ]])
      delete payload.say[infra_name]
    }
  }, { concurrency: 99 })
}

const reportConnection = async (infra_name, emitter) => {

  const { runRouteTeazwar } = require('./backend.helper')

  const body = {
    method: 'post',
    path: '/debug/socket-redis/connected',
    infra_name,
  }
  const { payload = {} } = await runRouteTeazwar(body)
  await dispatchSayOrder(payload, emitter)
  return payload
}

const getServerEmitter = (infra_name) => {
  if (!emitterHandler) {
    const redisClient = createClient({ host: 'localhost', port: 6379 })
    const emitter = new Emitter(redisClient)

    emitterHandler = (target, ...args) => (!target || !args || _.isEmpty(args)) ? null
      : emitter.to(target).emit(...args)

    reportConnection(infra_name, emitterHandler)
  }

  return emitterHandler
}

module.exports = {

  dispatchSayOrder,

  getSocket: () => io(socketUrl),

  getSocketEmitter: socket => {
    return (path, data = {}) => socket.emit({
      ...data, jwtoken: teazwarToken, method: 'post', path })
  },

  getServerEmitter,

  createSocketServer: () => new Server(),

  startSocketServer: io => {
    const pubClient = createClient({
      socket: {
        host: 'localhost',
        port: 6379,

      },
    })
    const subClient = pubClient.duplicate()
    io.adapter(createAdapter(pubClient, subClient))
    io.listen(backend.socketPort)
  },

  openInfraSocket: (infra_name, methods) => {
    const socket = io(socketUrl)
    socket.on('connect', () => {
      console.log('Infra Socket Connected: ', socket.id)
      socket.onAny(data => methods.onSocketMessage(socket, data))

      socket.emit({
        path: '/socket/infra/connected',
        method: 'post',
        jwtoken: teazwarToken,
        infra_name,
      })

      methods.onSocketConnect(socket)
    })
    socket.on('disconnect', reason => {

      socket.emit({
        path: '/socket/disconnected',
        method: 'post',
        jwtoken: teazwarToken,
        infra_name,
        reason,
      })

      methods.onSocketDisconnect(socket)
    })
    socket.on('connect_error', () => {
      console.log('Infra Socket Connection Error')
      methods.onSocketError(socket)
    })
    return socket
  },

}
