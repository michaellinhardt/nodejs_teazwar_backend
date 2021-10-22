const h = require('../../helpers')
const _ = require('lodash')
// const { render } = require('prettyjson')

const backend = async (method, path, body = {}) => {
  try {
    _.set(body, 'big_data.redis', h.redis)
    await h.backend.runRouteTeazwar({ ...body, method, path })

  } catch (err) { console.error(err) }
}

module.exports = async () => {
  h.redis.connect('silent')

  const timestamp = { sql: {}, redis: {} }

  const occurence = 1

  console.debug('start SQL test..')
  timestamp.sql.start = h.date.timestampMs()
  await backend('post', '/debug/sql/benchmark', { occurence: 1 })
  timestamp.sql.total = h.date.timestampMs() - timestamp.sql.start
  console.debug('time total: ', timestamp.sql.total, ' ms')

  console.debug('start REDIS test..')
  timestamp.redis.start = h.date.timestampMs()
  await backend('post', '/debug/redis/benchmark', { occurence: 1 })
  timestamp.redis.total = h.date.timestampMs() - timestamp.redis.start
  console.debug('time total: ', timestamp.redis.total, ' ms')

  return true
}
