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
    route: ['post', '/benchmark/sql/upd/prepare'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, body: b } = this
        const occurence = b.occurence || 10000

        const bots = []
        for (let i = 0; i < occurence; i++) {
          bots.push({ username: `u${i}@google.com` })
        }

        await Promise.map(bots, async bot => {
          await this.helpers.code.sleep(5)
          await s.bots.add(bot)
        }, { concurrency: 99 })

        const bots2 = await s.bots.getAll()
        console.debug(bots2[0], bots2[bots.length - 1])

      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/benchmark/sql/upd/case'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s } = this
        const bots = await s.bots.getAll()

        const uuids = []
        let sqlValues = ''
        _.forEach(bots, bot => {
          uuids.push(`'${bot.uuid}'`)
          sqlValues
          = `${sqlValues} WHEN '${bot.uuid}' THEN 'u${bot.id}@upd.case'`
        })

        const knex = this.helpers.knex.get()

        await knex.raw(`UPDATE bots
          SET username = CASE uuid ${sqlValues} ELSE username END
          WHERE uuid IN(${uuids})`)

        const bots2 = await s.bots.getAll()
        console.debug(bots2[0], bots2[bots.length - 1])

      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/benchmark/sql/upd/onduplicate'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s } = this
        const bots = await s.bots.getAll()

        const sqlValues = []
        _.forEach(bots, bot => {
          sqlValues.push(`('${bot.uuid}', 'u${bot.id}@upd.onduplicate')`)
        })

        const knex = this.helpers.knex.get()

        await knex.raw(`
          INSERT INTO bots (uuid, username)
            VALUES ${sqlValues.join(', ')}
            ON DUPLICATE KEY UPDATE username=VALUES(username);
        `)

        const bots2 = await s.bots.getAll()
        console.debug(bots2[0], bots2[bots.length - 1])

      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/benchmark/sql/upd/byone'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s } = this
        const bots = await s.bots.getAll()

        _.forEach(bots, bot => {
          bot.username = `u${bot.id}@upd.byone`
        })

        await Promise.map(bots, async bot => {
          await s.bots.knex()
            .update({ username: bot.username })
            .where({ uuid: bot.uuid })
        }, { concurrency: 99 })

        const bots2 = await s.bots.getAll()
        console.debug(bots2[0], bots2[bots.length - 1])

      }
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
          .where('id', '>', 0)
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
          // await this.helpers.code.sleep(1)
          await s.bots.add(bot)
        }, { concurrency: 99 })

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
          // await this.helpers.code.sleep(1)
          await r.set({ [`bot:${index}`]: bot })
        }, { concurrency: 99 })

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
