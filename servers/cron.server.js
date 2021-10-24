const _ = require('lodash')
const h = require('../helpers')
const config = require('../config')
const emitter = h.sockets.getServerEmitter('cron.server')

const backend = async (method, path, body = {}) => {
  _.set(body, 'big_data.redis', h.redis)
  const { payload = {} } = await h.backend.runRouteTeazwar({ ...body, method, path })
  await h.sockets.dispatchSayOrder(payload, emitter)
  return payload
}

const executeNextTask = async () => {
  let cronRouter = {}
  try {
    cronRouter = await backend('post', '/cron/router')

  } catch (err) {
    console.error(err)
    const { payload = {} } = await h.backend.discordReportError('cron_router', err.message)
    await h.sockets.dispatchSayOrder(payload, emitter)
    await h.code.sleep(config.cron.sleepWhenCronRouterError)
  }

  if (cronRouter.sleep) {
    const removeValue = 5
    const sleepRemove = cronRouter.sleep > removeValue ? removeValue : 0
    const sleepTime = cronRouter.sleep - sleepRemove
    console.info('SLEEP (cron router) ->', sleepTime)
    await h.code.sleep(sleepTime)
  }

  if (!cronRouter.task) { return false }

  const { big_data: { cron }, task } = cronRouter

  let taskResult = {}
  try {
    taskResult = await backend('post', `/cron${task.path}`)

  } catch (err) {
    console.error(err)
    taskResult.success = false
    taskResult.empty = false
    const taskPathKey = task.path.split('/').join('..')
    const { payload = {} } = await h.backend.discordReportError(`cron${taskPathKey}`, err.message)
    await h.sockets.dispatchSayOrder(payload, emitter)
    await h.code.sleep(config.cron.sleepWhenCronTaskError)
  }

  try {
    const cronInterval
      = await backend('post', '/cron/interval', { big_data: { cron }, task, taskResult })

    if (cronInterval.sleep) {
      const removeValue = 5
      const sleepRemove = cronInterval.sleep > removeValue ? removeValue : 0
      const sleepTime = cronInterval.sleep - sleepRemove
      console.info('SLEEP (cron interval) ->', sleepTime)
      await h.code.sleep(sleepTime)
    }

  } catch (err) {
    console.error(err)
    const { payload = {} } = await h.backend.discordReportError('cron_interval', err.message)
    await h.sockets.dispatchSayOrder(payload, emitter)
    await h.code.sleep(config.cron.sleepWhenCronTaskError)
  }

}

const start = async () => {
  try {
    await executeNextTask()

  } catch (err) {
    console.error(err)
    const { payload = {} } = await h.backend.discordReportError('cron_server_start', err.message)
    await h.sockets.dispatchSayOrder(payload, emitter)
    await h.code.sleep(config.cron.sleepWhenCronTaskError)
  }

  setTimeout(() => start(), config.cron.interval)
}

h.redis.connect('cron.server')
start()
