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
  timestamp.sql.result = 0
  timestamp.redis.result = 0

  const occurence = 300

  await backend('post', '/benchmark/init')
  await backend('post', '/benchmark/init')
  await backend('post', '/benchmark/init')

  console.info('\n === TESTING ADD PERF ===')

  console.info('\nstart ADD REDIS test..')
  timestamp.redis.start = h.date.timestampMs()
  await backend('post', '/benchmark/redis/add', { occurence })
  timestamp.redis.total = h.date.timestampMs() - timestamp.redis.start
  console.info('time total: ', timestamp.redis.total, ' ms')
  timestamp.redis.result += timestamp.redis.total

  console.info('start ADD SQL test..')
  timestamp.sql.start = h.date.timestampMs()
  await backend('post', '/benchmark/sql/add', { occurence })
  timestamp.sql.total = h.date.timestampMs() - timestamp.sql.start
  console.info('time total: ', timestamp.sql.total, ' ms')
  timestamp.sql.result += timestamp.sql.total

  console.info('\n === TESTING GET PERF ===')

  console.info('\nstart GET REDIS test..')
  timestamp.redis.start = h.date.timestampMs()
  await backend('post', '/benchmark/redis/get', { occurence })
  timestamp.redis.total = h.date.timestampMs() - timestamp.redis.start
  console.info('time total: ', timestamp.redis.total, ' ms')
  timestamp.redis.result += timestamp.redis.total

  console.info('\nstart GET SQL test..')
  timestamp.sql.start = h.date.timestampMs()
  await backend('post', '/benchmark/sql/get', { occurence })
  timestamp.sql.total = h.date.timestampMs() - timestamp.sql.start
  console.info('time total: ', timestamp.sql.total, ' ms')
  timestamp.sql.result += timestamp.sql.total

  console.info('\n === TESTING UPD PERF ===')

  console.info('\nstart UPD REDIS test..')
  timestamp.redis.start = h.date.timestampMs()
  await backend('post', '/benchmark/redis/upd', { occurence })
  timestamp.redis.total = h.date.timestampMs() - timestamp.redis.start
  console.info('time total: ', timestamp.redis.total, ' ms')
  timestamp.redis.result += timestamp.redis.total

  console.info('\nstart UPD SQL test..')
  timestamp.sql.start = h.date.timestampMs()
  await backend('post', '/benchmark/sql/upd', { occurence })
  timestamp.sql.total = h.date.timestampMs() - timestamp.sql.start
  console.info('time total: ', timestamp.sql.total, ' ms')
  timestamp.sql.result += timestamp.sql.total

  console.info('\nRESULTAT')
  console.info('- SQL: ', timestamp.sql.result, ' ms')
  console.info('- REDIS: ', timestamp.redis.result, ' ms')

  return true
}
