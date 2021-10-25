import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/cron/router'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, helpers: h } = this
        const cronDbBuild = await s.cronTasks.buildCronObject()

        const currTimestampMs = h.date.timestampMs()

        const task = s.cronTasks.getNextTask(currTimestampMs, cronDbBuild)
        if (!task) {

          const isSleep = this.services.cronTasks
            .calculateNextTaskTimestamp(cronDbBuild, currTimestampMs + 10)
          const sleep = isSleep > 0 ? { sleep: isSleep } : {}

          return p.cron.empty(sleep)
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
        await s.cronTasks.setTaskInterval(b.big_data.cron, b.task, b.taskResult)

        const currTimestampMs = this.helpers.date.timestampMs()

        const isSleep = this.services.cronTasks
          .calculateNextTaskTimestamp(b.big_data.cron, currTimestampMs + 10)
        const sleep = isSleep > 0 ? { sleep: isSleep } : {}

        p.cron.success(sleep)
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/cron/chatters/clean'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p } = this

        const nbChattersClean = await s.chatters.cleanTable()

        s.socketsInfra.emitSayDiscord(['server_chatters_clean', nbChattersClean])

        return nbChattersClean === 0 ? p.cron.empty() : p.cron.success()
      }
    },
  },
]
