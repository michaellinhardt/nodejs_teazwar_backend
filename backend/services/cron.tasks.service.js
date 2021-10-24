import _ from 'lodash'

import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'cron_tasks'

const { cron } = require('../../config')

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources) }

  async setTwitchApiNext (cron, task) {
    if (!task.isTwitchApi) { return true }
    const { helpers: h } = this
    const currTimestampMS = h.date.timestampMs()
    const tsnTwitchApiCall = currTimestampMS + cron.itvTwitchApiCall
    cron.tsnTwitchApiCall = tsnTwitchApiCall
    await this.updAllWhere({ path: 'twitch' }, { tsnCronTaskExec: tsnTwitchApiCall })
  }

  async setTaskInterval (cron, task, payload) {
    const { helpers: h } = this
    const currTimestampMs = h.date.timestampMs()
    const intervalSuccessOrError = payload.success ? task.itvWhenSuccess : task.itvWhenError
    task.tsnCronTaskExec = payload.empty
      ? currTimestampMs + task.itvWhenEmpty
      : currTimestampMs + intervalSuccessOrError

    const isTask = cron.tasks.find(t => t.path === task.path)
    if (isTask) {
      isTask.tsnCronTaskExec = task.tsnCronTaskExec
    }

    await this.updAllWhere({ path: task.path }, { tsnCronTaskExec: task.tsnCronTaskExec })
  }

  async buildCronObject () {
    const dbTasks = await this.knex()
      .select('*')
      .orderBy('id', 'ask')

    const twitchTask = dbTasks.shift()

    const mergedTasks = []
    _.forEach(cron.tasks, cfgTask => {
      const isDbTask = dbTasks.find(dbTask => dbTask.path === cfgTask.path)

      if (isDbTask) {
        mergedTasks.push({
          ...cfgTask,
          tsnCronTaskExec: isDbTask.tsnCronTaskExec || 0,
        })
      }
    })

    return {
      ...cron,
      tsnTwitchApiCall: twitchTask.tsnCronTaskExec,
      tasks: mergedTasks,
    }
  }

  calculateNextTaskTimestamp (cronDbBuild, nextTimestampMs) {
    const { services: s } = this

    const nextTask = s.cronTasks.getNextTask(nextTimestampMs, cronDbBuild)

    if (!nextTask) { return this.calculateNextTaskTimestamp(cronDbBuild, nextTimestampMs + 100) }

    const tsnCronTaskExec
      = (nextTask.isTwitchApi && cronDbBuild.tsnTwitchApiCall > nextTask.tsnCronTaskExec)
        ? cronDbBuild.tsnTwitchApiCall : nextTask.tsnCronTaskExec

    return tsnCronTaskExec - this.helpers.date.timestampMs()
  }

  getNextTask (currTimestamp, cronDbBuild) {
    let selectedTaskId = -1
    _.forEach(cronDbBuild.tasks, (task, taskId) => {
      const isLock = task.isTwitchApi && cronDbBuild.tsnTwitchApiCall > currTimestamp
      const isEnabled = _.get(task, 'isEnabled', true)
      if (isEnabled && !isLock
            && task.tsnCronTaskExec <= currTimestamp
            && selectedTaskId === -1) {
        selectedTaskId = taskId
        return false
      }
    })
    return selectedTaskId === -1 ? false : cronDbBuild.tasks[selectedTaskId]
  }

}
