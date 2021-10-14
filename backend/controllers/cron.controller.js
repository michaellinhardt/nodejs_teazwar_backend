import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    route: ['post', '/cron/router'],
    isPublic: false,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        try {

          const cron = await s.cronTasks.buildCronObject()

          const task = s.cronTasks.getNextTask(cron)
          if (!task) {
            this.payload = p.cron.empty()
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
    route: ['post', '/cron/interval'],
    isPublic: false,
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