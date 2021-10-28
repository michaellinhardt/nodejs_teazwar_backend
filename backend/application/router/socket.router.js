const _ = require('lodash')

const { runRoute, runRouteTeazwar } = require('../../../helpers/files/backend.helper')
const SocketHelper = require('../../../helpers/files/sockets.helper')
const BackendHelper = require('../../../helpers/files/backend.helper')

let redis = null

const emitter = SocketHelper.getServerEmitter('socket.router')

const onAny = async (socket, infraData = {}, extensionData = {}) => {
  let data = {}
  if (typeof (infraData) === 'string') {
    data = extensionData
  } else if (typeof (infraData) === 'object' && !Array.isArray(infraData)) {
    data = infraData
  } else {
    return { error_key: 'socketRouter_dataFormat' }

  }

  data.path = _.get(data, 'path', '')
  data.method = _.get(data, 'method', '')
  data.jwtoken = _.get(data, 'jwtoken', undefined)
  _.set(data, 'big_data.redis', redis)
  _.set(data, 'big_data.socket', socket)

  try {
    const { payload = {} } = await runRoute(data)
    await SocketHelper.dispatchSayOrder(payload, emitter)

  } catch (err) {
    console.error(err)
    const error_location = `socket_router${data.path.split('/').join('..')}`
    const { payload = {} } = await BackendHelper
      .discordReportError(error_location, err.message)
    await SocketHelper.dispatchSayOrder(payload, emitter)
  }
}

const onDisconnect = async (socket, reason) => {
  const data = {
    path: '/socket/disconnected',
    method: 'post',
    reason,
    infra_name: 'unknow',
  }
  _.set(data, 'big_data.redis', redis)
  _.set(data, 'big_data.socket', socket)

  try {
    const { payload } = await runRouteTeazwar(data)
    await SocketHelper.dispatchSayOrder(payload, emitter)

    return payload

  } catch (err) {
    console.error(err)
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
