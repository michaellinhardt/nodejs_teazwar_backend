const Promise = require('bluebird')
const _ = require('lodash')
const config = require('../../config')
const { createClient } = require('ioredis')
const { promisify } = require('util')

let client = null

const reportConnection = async (infra_name) => {

  const { runRouteTeazwar } = require('./backend.helper')
  const { dispatchSayOrder } = require('./sockets.helper')

  const body = {
    method: 'post',
    path: '/debug/redis/connected',
    infra_name,
    big_data: { redis: exports },
  }
  const { payload = {} } = await runRouteTeazwar(body)
  await dispatchSayOrder(payload, infra_name)
  return payload
}

const onClientError = () => client.on('error', (err) => console.log('Redis Client Error', err))
const connect = (infra_name = 'unknow') => {
  if (client) { return client }
  if (config.redis.activated) {
    client = createClient()
    onClientError()
    const getAddr = client.get
    client.get = promisify(getAddr).bind(client)
    if (infra_name !== 'silent') {
      reportConnection(infra_name)
    }
  } else { client = 'disable' }
  exports.client = client
  return client
}

const set = (keysValuesObject) => {
  const saveItems = []
  _.forEach(keysValuesObject, (value, key) => saveItems.push([key, JSON.stringify(value)]))

  return Promise.map(saveItems, saveItem => {
    return client.set(saveItem)
  }, { concurrency: 99 })
}

const get = async (...keys) => {
  const result = {}
  await Promise.map(keys, async key => {
    const value = await client.get(key)
    result[key] = JSON.parse(value)
  }, { concurrency: 99 })
  return result
}

const reset = async () => {
  if (!config.redis.activated) {
    return console.info('Redis reset abort (config.redis.activated = false)')
  }
  connect('silent')
  const flushall = promisify(client.flushall).bind(client)
  await flushall()
  await set(config.redis.reset)
}

const exports = { connect, reset, set, get }

module.exports = exports

