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

  const timestamp = { case: {}, onduplicate: {}, byone: {}, prepare: {} }
  timestamp.case.result = 0
  timestamp.onduplicate.result = 0
  timestamp.byone.result = 0
  timestamp.prepare.result = 0

  const occurence = 100

  await backend('post', '/benchmark/init')
  await backend('post', '/benchmark/init')
  await backend('post', '/benchmark/init')

  console.info('\n === TESTING PREPARE ===')

  console.info('\nstart PREPARE test..')
  timestamp.prepare.start = h.date.timestampMs()
  await backend('post', '/benchmark/sql/upd/prepare', { occurence })
  timestamp.prepare.total = h.date.timestampMs() - timestamp.prepare.start
  console.info('time total: ', timestamp.prepare.total, ' ms')
  timestamp.prepare.result += timestamp.prepare.total

  console.info('start CASE test..')
  timestamp.case.start = h.date.timestampMs()
  await backend('post', '/benchmark/sql/upd/case', { occurence })
  timestamp.case.total = h.date.timestampMs() - timestamp.case.start
  console.info('time total: ', timestamp.case.total, ' ms')
  timestamp.case.result += timestamp.case.total

  console.info('\nstart ON DUPLICATE test..')
  timestamp.onduplicate.start = h.date.timestampMs()
  await backend('post', '/benchmark/sql/upd/onduplicate', { occurence })
  timestamp.onduplicate.total = h.date.timestampMs() - timestamp.onduplicate.start
  console.info('time total: ', timestamp.onduplicate.total, ' ms')
  timestamp.onduplicate.result += timestamp.onduplicate.total

  console.info('\nstart BY ONE test..')
  timestamp.byone.start = h.date.timestampMs()
  await backend('post', '/benchmark/sql/upd/byone', { occurence })
  timestamp.byone.total = h.date.timestampMs() - timestamp.byone.start
  console.info('time total: ', timestamp.byone.total, ' ms')
  timestamp.byone.result += timestamp.byone.total

  console.info('\nRESULTAT')
  console.info('- PREPARE: ', timestamp.prepare.result, ' ms')
  console.info('- CASE: ', timestamp.case.result, ' ms')
  console.info('- ON DUPLICATE: ', timestamp.onduplicate.result, ' ms')
  console.info('- BY ONE: ', timestamp.byone.result, ' ms')

  return true
}
