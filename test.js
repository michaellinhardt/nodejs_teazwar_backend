const redis = require('./helpers/files/redis.helper')
redis.connect('silent')

const start = async () => {
  // await redis.set({ socketIds: { lol: 'ah' } })
  const { socketIds } = await redis.get('socketIds')
  console.debug(socketIds)
  process.exit(0)
}

start()

