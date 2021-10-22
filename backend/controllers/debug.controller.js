import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/debug/test/onduplicate'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, body: b } = this
        const occurence = b.occurence || 10000

        const bots = []
        for (let i = 0; i < occurence; i++) {
          bots.push({ username: 'u@google.com' })
        }

        await s.bots.addArray(bots)

        const bots2 = await s.bots.getAll()
        this.helpers.code.dump(bots2)

        _.forEach(bots2, (bot, index) => {
          bot.username = `bot${(index + 1)}.yeah`
          delete bot.id
        })

        bots2.shift()

        bots2.push({ username: 'IM NEW' })
        bots2.push({ username: 'IM NEW 2' })

        await s.bots.addOrUpdArray(bots2)

        const bots3 = await s.bots.getAll()
        console.info('\n\n===')
        this.helpers.code.dump(bots3)
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/debug/discord/report'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, body: b } = this
        if (!b.errorArray || !Array.isArray(b.errorArray)) {
          return false
        }
        await s.socketsInfra.emitError(b.errorArray)
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/debug/redis/connected'],
    Controller: class extends ControllerSuperclass {
      handler () {
        const { services: s, body: b } = this
        s.socketsInfra.emitSayDiscord(['server_redis_connected', b.infra_name])
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/debug/socket-redis/connected'],
    Controller: class extends ControllerSuperclass {
      handler () {
        const { services: s, body: b } = this
        s.socketsInfra.emitSayDiscord(['server_socket_redis_connected', b.infra_name])
      }
    },
  },
]
