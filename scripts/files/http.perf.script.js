const h = require('../../helpers')
const { jwt: { teazwarToken } } = require('../../config')
const _ = require('lodash')
import superagent from 'superagent'

const backend = async (path, body = {}) => {
  try {
    _.set(body, 'big_data.redis', h.redis)

    await superagent
      .post(`http://localhost:14242${path}`)
      .send(body)
      .set('x-access-token', teazwarToken)
      .set('Accept', 'application/json')
      .catch(console.error)

  } catch (err) { console.error(err) }
}

module.exports = async () => {
  h.redis.connect('silent')

  const timestamp = { sql: {}, redis: {} }
  timestamp.sql.result = 0
  timestamp.redis.result = 0

  const occurence = 100

  await backend('/benchmark/init')
  await backend('/benchmark/init')
  await backend('/benchmark/init')

  console.info('\n === TESTING ADD PERF ===')

  console.info('start ADD SQL test..')
  timestamp.sql.start = h.date.timestampMs()
  await backend('/benchmark/sql/add', { occurence })
  timestamp.sql.total = h.date.timestampMs() - timestamp.sql.start
  console.info('time total: ', timestamp.sql.total, ' ms')
  timestamp.sql.result += timestamp.sql.total

  console.info('\nstart ADD REDIS test..')
  timestamp.redis.start = h.date.timestampMs()
  await backend('/benchmark/redis/add', { occurence })
  timestamp.redis.total = h.date.timestampMs() - timestamp.redis.start
  console.info('time total: ', timestamp.redis.total, ' ms')
  timestamp.redis.result += timestamp.redis.total

  console.info('\n === TESTING GET PERF ===')

  console.info('\nstart GET SQL test..')
  timestamp.sql.start = h.date.timestampMs()
  await backend('/benchmark/sql/get', { occurence })
  timestamp.sql.total = h.date.timestampMs() - timestamp.sql.start
  console.info('time total: ', timestamp.sql.total, ' ms')
  timestamp.sql.result += timestamp.sql.total

  console.info('\nstart GET REDIS test..')
  timestamp.sql.start = h.date.timestampMs()
  await backend('/benchmark/redis/get', { occurence })
  timestamp.sql.total = h.date.timestampMs() - timestamp.sql.start
  console.info('time total: ', timestamp.sql.total, ' ms')
  timestamp.redis.result += timestamp.redis.total

  console.info('\n === TESTING UPD PERF ===')

  console.info('\nstart UPD SQL test..')
  timestamp.sql.start = h.date.timestampMs()
  await backend('/benchmark/sql/upd', { occurence })
  timestamp.sql.total = h.date.timestampMs() - timestamp.sql.start
  console.info('time total: ', timestamp.sql.total, ' ms')
  timestamp.sql.result += timestamp.sql.total

  console.info('\nstart UPD REDIS test..')
  timestamp.sql.start = h.date.timestampMs()
  await backend('/benchmark/redis/upd', { occurence })
  timestamp.sql.total = h.date.timestampMs() - timestamp.sql.start
  console.info('time total: ', timestamp.sql.total, ' ms')
  timestamp.redis.result += timestamp.redis.total

  console.info('\nRESULTAT')
  console.info('- SQL: ', timestamp.sql.result, ' ms')
  console.info('- REDIS: ', timestamp.redis.result, ' ms')

  return true
}
