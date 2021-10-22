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
  const occurence = 4
  await backend('post', '/debug/test/onduplicate', { occurence })
  return true
}
