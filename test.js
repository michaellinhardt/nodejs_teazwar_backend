const redis = require('./helpers/files/redis.helper')
redis.connect('silent')

const start = async () => {
  await redis.set({ payload: 5, olol: 'ok', obj: { fire: 2 } })
  const { payload, olol: test } = await redis.get('payload')
  console.debug(payload, test)
}

start()
setTimeout(start, 2000)
