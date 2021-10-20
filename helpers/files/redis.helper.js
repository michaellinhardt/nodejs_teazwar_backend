const { createClient } = require('redis')
const { promisify } = require('util')

let client = null

const reportConnection = async (infra_name) => {

  const { runRouteTeazwar } = require('./backend.helper')
  const { dispatchSayOrder } = require('./sockets.helper')

  const body = {
    method: 'post',
    path: '/debug/redis/connected',
    infra_name,
    big_data: { redis: client },
  }
  const { payload = {} } = await runRouteTeazwar(body)
  await dispatchSayOrder(payload, infra_name)
  return payload
}

const onClientError = () => client.on('error', (err) => console.log('Redis Client Error', err))
const connect = (infra_name = 'unknow') => {
  if (client) { return client }
  console.debug('CREATE CLIENT')
  client = createClient()
  onClientError()
  const getAddr = client.get
  client.get = promisify(getAddr).bind(client)
  reportConnection(infra_name)
  return client
}

module.exports = {

  connect,

  set: (...args) => {
    return client.set(...args)
  },

  get: (...args) => {
    return client.get(...args)
  },

}

