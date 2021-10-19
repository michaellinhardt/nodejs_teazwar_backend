const _ = require('lodash')
const { io } = require('socket.io-client')
const { backend, jwt: { teazwarToken } } = require('../../config')
const socketUrl = `${backend.uri}:${backend.socketPort}`

const { Server } = require('socket.io')
const { createAdapter } = require('@socket.io/redis-adapter')
const { Emitter } = require('@socket.io/redis-emitter')
const { createClient } = require('redis')

module.exports = {
  getSocket: () => io(socketUrl),

  getSocketEmitter: socket => {
    return (path, data = {}) => socket.emit({
      ...data, jwtoken: teazwarToken, method: 'post', path })
  },

  getServerEmitter: () => {
    const redisClient = createClient({ host: 'localhost', port: 6379 })
    const emitter = new Emitter(redisClient)

    return (socket_id, ...args) => (!socket_id || !args || _.isEmpty(args)) ? null
      : emitter.to(socket_id).emit(...args)
  },

  createSocketServer: () => new Server(),

  startSocketServer: io => {
    const pubClient = createClient({
      host: 'localhost',
      port: 6379,
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
      methods.backend('post', '/socket/infra/connected', { infra_name, socket_id: socket.id })
      methods.onSocketConnect(socket)
    })
    socket.on('disconnect', reason => {
      methods.backend('post', '/socket/disconnected', { infra_name, socket_id: socket.id, reason })
      methods.onSocketDisconnect(socket)
    })
    socket.on('connect_error', () => {
      console.log('Infra Socket Connection Error')
      methods.onSocketError(socket)
    })
    return socket
  },

}
