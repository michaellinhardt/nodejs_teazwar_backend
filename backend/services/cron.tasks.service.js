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
    const tsnTwitchApiCall = currTimestamp + cron.itvTwitchApiCall
    await this.updAllWhere({ path: 'twitch' }, { tsnCronTaskExec: tsnTwitchApiCall })
  }

  async setTaskInterval (task, payload) {
    const { helpers: h } = this
    const currTimestamp = h.date.timestamp()
    const interval = payload.success ? task.itvWhenSuccess : task.itvWhenError
    task.tsnCronTaskExec = currTimestamp + interval
    task.tsnCronTaskExec = payload.empty ? currTimestamp + task.itvWhenEmpty : task.tsnCronTaskExec
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
