import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/cron/router'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, helpers: h } = this
        const cron = await s.cronTasks.buildCronObject()

        const currTimestamp = h.date.timestamp()

        const task = s.cronTasks.getNextTask(currTimestamp, cron)
        if (!task) {

          const nextTaskIn = (seconds = 1) => {
            const nextTimestamp = currTimestamp + seconds
            const nextTask = s.cronTasks.getNextTask(nextTimestamp, cron)
            if (!nextTask) { return nextTaskIn(seconds + 1) }
            return seconds
          }

          const seconds = nextTaskIn()

          return p.cron.empty({ sleep: seconds })
        }

        p.cron.success({ cron, task })
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/cron/interval'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, body: b } = this

        await s.cronTasks.setTwitchApiNext(b.cron, b.task)
        await s.cronTasks.setTaskInterval(b.task, b.taskResult)

        p.cron.success()
      }
    },
  },
]
