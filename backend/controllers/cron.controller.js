import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/cron/router'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, helpers: h } = this
        const cronDbBuild = await s.cronTasks.buildCronObject()

        const currTimestamp = h.date.timestamp()

        const task = s.cronTasks.getNextTask(currTimestamp, cronDbBuild)
        if (!task) {

          const nextTaskIn = (seconds = 1) => {
            const nextTimestamp = currTimestamp + seconds
            const nextTask = s.cronTasks.getNextTask(nextTimestamp, cronDbBuild)
            if (!nextTask) { return nextTaskIn(seconds + 1) }
            return seconds
          }

          const seconds = nextTaskIn()

          return p.cron.empty({ sleep: seconds })
        }

        p.cron.success({ big_data: { cron: cronDbBuild }, task })
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/cron/interval'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, body: b } = this

        await s.cronTasks.setTwitchApiNext(b.big_data.cron, b.task)
        await s.cronTasks.setTaskInterval(b.task, b.taskResult)

        p.cron.success()
      }
    },
  },
]
