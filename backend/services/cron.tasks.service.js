import _ from 'lodash'

import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'cron_tasks'

const { cron } = require('../../config')

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources) }

  async setTwitchApiNext (cron, task) {
    if (!task.isTwitchApi) { return true }
    const { helpers: h } = this
    const currTimestamp = h.date.timestamp()
    const twitchApiNext = currTimestamp + cron.twitchApiInterval
    await this.updAllWhere({ path: 'twitch' }, { timestampNext: twitchApiNext })
  }

  async setTaskInterval (task, payload) {
    const { helpers: h } = this
    const currTimestamp = h.date.timestamp()
    const interval = payload.success ? task.interval : task.intervalRetry
    task.timestampNext = currTimestamp + interval
    task.timestampNext = payload.empty ? currTimestamp + task.intervalEmpty : task.timestampNext
    await this.updAllWhere({ path: task.path }, { timestampNext: task.timestampNext })
  }

  async buildCronObject () {
    const tasks = await this.knex()
      .select('*')
      .where({ isDeleted: false })
      .orderBy('id', 'ask')

    const twitchTask = tasks.shift()
    
    const mergedTasks = []
    _.forEach(cron.tasks, c => {
      const isTask = tasks.find(t => t.path === c.path)

      if (isTask) {
        mergedTasks.push({
          ...c,
          timestampNext: isTask.timestampNext
        })
      }
    })

    return {
      ...cron,
      twitchApiNext: twitchTask.timestampNext,
      tasks: mergedTasks,
    }
  }

  getNextTask (currTimestamp, cron) {
    let selectedTaskId = -1
    _.forEach(cron.tasks, (task, taskId) => {
        const isLock = task.isTwitchApi && cron.twitchApiNext > currTimestamp
        const isEnabled = _.get(task, 'isEnabled', true)
        if (isEnabled && !isLock
            && task.timestampNext <= currTimestamp
            && selectedTaskId === -1) {
              selectedTaskId = taskId
              return false
        }
    })
    return selectedTaskId === -1 ? false : cron.tasks[selectedTaskId]
}

}
