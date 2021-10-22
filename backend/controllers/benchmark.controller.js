const _ = require('lodash')
const Promise = require('bluebird')

import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/benchmark/init'],
    Controller: class extends ControllerSuperclass {
      handler () { console.info('\nBackend files are loaded!') }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/benchmark/sql/upd'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s } = this
        const bots = await s.bots.knex()
          .update({ username: 'lol' })
          .where({ isDeleted: false })
          .andWhere('id', '>', 0)
        console.info(`SQL UPD: ${bots} entries`)
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/benchmark/redis/upd'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { promisify } = require('util')

        const client = this.redis.client
        const scan = promisify(client.scan).bind(client)

        const scanAll = async (pattern) => {
          const found = []
          let cursor = '0'

          do {
            const reply = await scan(cursor, 'MATCH', pattern)

            cursor = reply[0]
            found.push(...reply[1])
          } while (cursor !== '0')

          return found
        }

        const keys = await scanAll('bot:*')
        const redisCmd = []
        _.forEach(keys, key => redisCmd.push(['set', key, 'lol']))

        const bots = await client
          .pipeline(redisCmd)
          .exec()

        // const bots = await this.redis.get('bot:0')
        console.info(`REDIS UPD: ${bots.length} entries`)
        // console.info(bots)

      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/benchmark/sql/add'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, body: b } = this
        const occurence = b.occurence || 10000

        const bots = []
        for (let i = 0; i < occurence; i++) {
          bots.push({ username: `u${i}` })
        }

        await Promise.map(bots, async bot => {
          await this.helpers.code.sleep(5)
          await s.bots.add(bot)
        }, { concurrency: 1 })

      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/benchmark/redis/add'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { redis: r, body: b } = this
        const occurence = b.occurence || 10000

        const bots = []
        for (let i = 0; i < occurence; i++) {
          bots.push({ username: `u${i}` })
        }

        await Promise.map(bots, async (bot, index) => {
          await this.helpers.code.sleep(5)
          await r.set({ [`bot:${index}`]: bot })
        }, { concurrency: 1 })

      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/benchmark/sql/get'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s } = this

        const bots = await s.bots.getAll()
        console.info(`SQL GET: ${bots.length} entries`)
        // console.info(bots)

      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/benchmark/redis/get'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { promisify } = require('util')

        const client = this.redis.client
        const scan = promisify(client.scan).bind(client)

        const scanAll = async (pattern) => {
          const found = []
          let cursor = '0'

          do {
            const reply = await scan(cursor, 'MATCH', pattern)

            cursor = reply[0]
            found.push(...reply[1])
          } while (cursor !== '0')

          return found
        }

        const keys = await scanAll('bot:*')
        const redisCmd = []
        _.forEach(keys, key => redisCmd.push(['get', key]))

        const bots = await client
          .pipeline(redisCmd)
          .exec()

        // const bots = await this.redis.get('bot:0')
        console.info(`REDIS GET: ${bots.length} entries`)
        // console.info(bots)

      }
    },
  },
]
