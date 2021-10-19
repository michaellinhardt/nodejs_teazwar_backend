const _ = require('lodash')

const { runRoute, runRouteTeazwar } = require('../../../helpers/files/backend.helper')

const onAny = async (socket, data = {}) => {
  if (typeof (data) !== 'object' || Array.isArray(data)) {
    return { error_key: 'socketRouter_dataFormat' }
  }

  data.path = _.get(data, 'path', '')
  data.method = _.get(data, 'method', '')
  data.jwtoken = _.get(data, 'jwtoken', undefined)
  data.socket_id = socket.id

  await runRoute(data)

  try {
    await runRoute(data)

  } catch (err) {
    console.debug(err)
    const BackendHelper = require('../../../helpers/files/backend.helper')
    const error_location = `socket_router${data.path.split('/').join('..')}`
    const { payload = {} } = await BackendHelper
      .discordReportError(error_location, err.message)

    if (payload.say && payload.socketIds) {
      const SocketHelper = require('../../../helpers/files/sockets.helper')
      await SocketHelper.dispatchSayOrder(payload)
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

  const { payload } = await runRouteTeazwar(data)
  return payload
}

module.exports = {
  init: io => io.on('connection', (socket) => {
    socket.on('disconnect', reason => onDisconnect(socket, reason))
    socket.onAny((data = {}) => onAny(socket, data))
    console.info('socket connection: ', socket.id)
  }),
}
