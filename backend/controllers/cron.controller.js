import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/cron/router'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, helpers: h } = this
        try {

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

            this.payload = p.cron.empty({ sleep: seconds })
            return true

          }

          this.payload = p.cron.success({ cron, task })
          return true

        } catch (err) {
          console.error(err)
          this.payload = p.cron.error()
          return true
        }
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/cron/interval'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, body: b } = this
        try {

          await s.cronTasks.setTwitchApiNext(b.cron, b.task)
          await s.cronTasks.setTaskInterval(b.task, b.taskResult)

          this.payload = p.cron.success()
          return true

        } catch (err) {
          console.error(err)
          this.payload = p.cron.error()
          return true
        }
      }
    },
  },
]
