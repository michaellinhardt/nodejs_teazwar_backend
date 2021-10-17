const h = require('../helpers')
const config = require('../config')

const backend = (method, path, body = {}) => h.backend.runRouteTeazwar({ ...body, method, path })

const executeNextTask = async () => {
  const { payload: cronRouter } = await backend('post', '/cron/router')

  if (!cronRouter.task) {
    // console.debug('NEXT TASK IN ->', cronRouter.sleep)
    await h.code.sleep(cronRouter.sleep * 1000 - 600)
    return false
  }

  const { cron, task } = cronRouter

  const { payload: taskResult } = await backend('post', `/cron${task.path}`)

  await backend('post', '/cron/interval', { cron, task, taskResult })

  console.debug(task.path, taskResult)
}

const start = async () => {
  try {
    await executeNextTask()

  } catch (err) { console.debug('error while doing cron task', err) }

  setTimeout(() => start(), config.cron.interval)
}

start()
