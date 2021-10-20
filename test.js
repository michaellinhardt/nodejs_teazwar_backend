const redis = require('./helpers/files/redis.helper')
redis.connect('test.js')

const start = async () => {
  await redis.set('key', 'valueeddddde')
  const value = await redis.get('key')
  console.debug(value)
}

start()
setTimeout(start, 2000)

