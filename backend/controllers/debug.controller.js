const Promise = require('bluebird')

import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
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
  {
    isTeazwar: true,
    route: ['post', '/debug/sql/benchmark'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, body: b } = this
        const occurence = b.occurence || 10000

        const bots = []
        for (let i = 0; i < occurence; i++) {
          bots.push({ username: `u${i}` })
        }

        console.info(`Occurence: ${bots.length}`)

        await Promise.each(bots, async bot => {
          await s.bots.add(bot)
        }, { concurrency: 5 })

        await s.bots.addArray(bots)

        await Promise.each(bots, async bot => {
          if (bot) {
            await s.bots.getFirstWhere({ id: 1 })
          }
        }, { concurrency: 5 })
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/debug/redis/benchmark'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { redis: r, body: b } = this
        const occurence = b.occurence || 10000

        const bots = []
        const botObj = {}
        for (let i = 0; i < occurence; i++) {
          const bot = { username: `u${i}` }
          bots.push(bot)
          botObj[`bot_${i}`] = bot
        }

        console.info(`Occurence: ${bots.length}`)

        await Promise.each(bots, async (bot, index) => {
          await r.set({ [`bot_${index}`]: bot })
        }, { concurrency: 5 })

        await r.set(bots)

        await Promise.each(bots, async (bot, index) => {
          if (bot) {
            await r.get(`bot_${index}`)
          }
        }, { concurrency: 5 })
      }
    },
  },
]
