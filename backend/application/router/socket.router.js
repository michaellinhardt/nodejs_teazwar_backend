const _ = require('lodash')

const { runRoute, runRouteTeazwar } = require('../../../helpers/files/backend.helper')
const SocketHelper = require('../../../helpers/files/sockets.helper')
const BackendHelper = require('../../../helpers/files/backend.helper')

let redis = null

const emitter = SocketHelper.getServerEmitter('socket.router')

const onAny = async (socket, infraData = {}, extensionData = {}) => {
  let data = {}
  let call_uuid
  if (typeof (infraData) === 'string') {
    data = extensionData
    call_uuid = infraData

  } else if (typeof (infraData) === 'object' && !Array.isArray(infraData)) {
    data = infraData
  } else {
    return { error_key: 'socketRouter_dataFormat' }

  }

  data.path = _.get(data, 'path', '')
  data.method = _.get(data, 'method', '')
  data.jwtoken = _.get(data, 'jwtoken', undefined)
  data.call_uuid = call_uuid

  _.set(data, 'big_data.redis', redis)
  _.set(data, 'big_data.socket', socket)

  try {
    const { payload = {} } = await runRoute(data)
    await SocketHelper.dispatchSayOrder(payload, emitter)
    if (call_uuid) {
      delete payload.say
      socket.emit(call_uuid, { ressources: payload })
    }

  } catch (err) {
    console.error(err.message, payload)
    const error_location = `socket_router${data.path.split('/').join('..')}`

    const { payload = {} } = await BackendHelper
      .discordReportError(error_location, err.message)
    await SocketHelper.dispatchSayOrder(payload, emitter)
    if (call_uuid) {
      delete payload.say
      socket.emit(call_uuid, { ressources: payload })
    }
  }
}

const onDisconnect = async (socket, reason) => {
  const data = {
    path: '/socket/disconnected',
    method: 'post',
    reason,
    socket_id: socket.id,
  }
  _.set(data, 'big_data.redis', redis)
  _.set(data, 'big_data.socket', socket)

  try {
    const { payload } = await runRouteTeazwar(data)
    await SocketHelper.dispatchSayOrder(payload, emitter)

    return payload

  } catch (err) {
    console.error(err.message, payload)
    const { payload = {} } = await BackendHelper
      .discordReportError('socket_disconnected', err.message)
    await SocketHelper.dispatchSayOrder(payload, emitter)

    return payload
  }
}

module.exports = {
  init: (io, redisHandler) => io.on('connection', (socket) => {
    if (!redis) { redis = redisHandler }
    socket.on('disconnect', reason => onDisconnect(socket, reason))
    socket.onAny((...args) => onAny(socket, ...args))
    console.info('socket connection: ', socket.id)
  }),
}
