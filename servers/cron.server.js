const Promise = require('bluebird')
const _ = require('lodash')
const h = require('../helpers')
const config = require('../config')
const emitter = h.sockets.getServerEmitter()

const backend = async (method, path, body = {}) => {
  const { payload = {} } = await h.backend.runRouteTeazwar({ ...body, method, path })
  executePayloadOrder(payload)
  return payload
}

const executePayloadOrder = async payload => {
  if (!payload || typeof (payload) !== 'object') { return true }

  const executeSequence = (method, contents) => !contents.length ? true
    : Promise.each(contents, content => content.length ? method(...content) : true,
      { concurrency: 1 })

  await executeSequence(emitter, [[
    _.get(payload, 'socketIds.twitch', null),
    { say: { discord: _.get(payload, 'say.twitch', []) } },
  ]])
  await executeSequence(emitter, [[
    _.get(payload, 'socketIds.discord', null),
    { say: { discord: _.get(payload, 'say.discord', []) } },
  ]])
}

const executeNextTask = async () => {
  let cronRouter = {}
  try {
    cronRouter = await backend('post', '/cron/router')

  } catch (err) {
    console.debug(err)
    const { payload = {} } = await h.backend.discordReportError('cron_router', err.message)
    executePayloadOrder(payload)
    await h.code.sleep(config.cron.sleepWhenCronRouterError)
  }

  if (!cronRouter.task) {
    // console.debug('NEXT TASK IN ->', cronRouter.sleep)
    await h.code.sleep((cronRouter.sleep * 1000) - 600)
    return false
  }

  const { cron, task } = cronRouter

  let taskResult = {}
  try {
    taskResult = await backend('post', `/cron${task.path}`)

  } catch (err) {
    console.debug(err)
    taskResult.success = false
    taskResult.empty = false
    const taskPathKey = task.path.split('/').join('..')
    const { payload = {} } = await h.backend.discordReportError(`cron${taskPathKey}`, err.message)
    executePayloadOrder(payload)
    await h.code.sleep(config.cron.sleepWhenCronTaskError)
  }

  try {
    await backend('post', '/cron/interval', { cron, task, taskResult })

  } catch (err) {
    console.debug(err)
    const { payload = {} } = await h.backend.discordReportError('cron_interval', err.message)
    executePayloadOrder(payload)
    await h.code.sleep(config.cron.sleepWhenCronTaskError)
  }

  console.debug(task.path, taskResult)
}

const start = async () => {
  try {
    await executeNextTask()

  } catch (err) {
    console.debug(err)
    const { payload = {} } = await h.backend.discordReportError('cron_server_start', err.message)
    executePayloadOrder(payload)
    await h.code.sleep(config.cron.sleepWhenCronTaskError)
  }

  setTimeout(() => start(), config.cron.interval)
}

start()
