import * as Promise from 'bluebird'
import _ from 'lodash'
const { xp } = require('../../config')

import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'user_xp'

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources) }

  async addMissingEntry (users) {
    const userUuids = users.map(u => u.uuid)
    const existing = await this.getAllFirstWhereIn('user_uuid', userUuids)

    const missing = []
    _.forEach(userUuids, uuid => {
      const isExisting = existing.find(u => u.user_uuid === uuid)
      if (!isExisting) { missing.push({ user_uuid: uuid }) }
    })

    if (missing.length) {
      await this.addArray(missing)
    }
  }

  calculateXpMultiplier (user) {
    let xpMultiplier = 1
    if (user.isFollower === 'yes') { xpMultiplier = xp.multiplierFollower }
    if (user.isSubscriber === 'yes') { xpMultiplier = xp.multiplierSubscriber }
    return xpMultiplier
  }
  calculateXpPerMin (user) {
    const xpMultiplier = this.calculateXpMultiplier(user)
    return xp.xpPerMin * xpMultiplier
  }
  calculateMinToLevelUp (user) {
    const xpPerMin = this.calculateXpPerMin(user)
    console.debug(xpPerMin)
    return Math.ceil((user.level_xp_max - user.level_xp) / xpPerMin)
  }
  calculateHourToLevelUp (user) {
    const minToLevelUp = this.calculateMinToLevelUp(user)
    const hourToLevelUp = minToLevelUp / 60
    return Math.round((hourToLevelUp + Number.EPSILON) * 100) / 100
  }

  async increaseLevel (usersXp) {
    const { helpers: h } = this

    await Promise.each(usersXp, async userXp => {
      const update = {
        level: userXp.level + 1,
        level_xp: userXp.level_xp - userXp.level_xp_max,
        level_xp_max: h.xp.xpRequired(userXp.level + 1),
      }
      await this.updAllWhere({ user_uuid: userXp.user_uuid }, update)

    }, { concurrency: 3 })
  }

  async getRequireLevelUp () {
    const where = { isDeleted: false }
    return this.knex()
      .where(where)
      .andWhereRaw('?? >= ??', ['user_xp.level_xp', 'user_xp.level_xp_max'])
  }

  async addXpGain (users, chatters) {
    const { helpers: h } = this

    const xpGains = []
    await Promise.each(users, async user => {
      let xpPerMin = h.xp.xpPerMin()
      let xpLabel = 'total_xp_normal'

      if (user.isFollower === 'yes') {
        xpPerMin = h.xp.xpPerMinFollower()
        xpLabel = 'total_xp_follower'
      }
      if (user.isSubscriber === 'yes') {
        xpPerMin = h.xp.xpPerMinSubscriber()
        xpLabel = 'total_xp_subscriber'
      }

      const chatter = chatters.find(c => c.username === user.username)
      const count_seen = _.get(chatter, 'count_seen', 0)
      const xpGain = count_seen * xpPerMin

      await this.incrementAllWhere({ user_uuid: user.uuid }, {
        level_xp: xpGain,
        [xpLabel]: count_seen,
      })

      xpGains.push([user.username, xpGain])

    }, { concurrency: 3 })

    return xpGains
  }
}
