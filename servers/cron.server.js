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

  if (!cronRouter.task) {
    // console.info('NEXT TASK IN ->', cronRouter.sleep)
    await h.code.sleep((cronRouter.sleep * 1000) - 600)
    return false
  }

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
    await backend('post', '/cron/interval', { big_data: { cron }, task, taskResult })

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
