import * as Promise from 'bluebird'
import _ from 'lodash'

import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'user_stats'

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources) }

  async addMissingEntry (users) {
    const addOrUpdate = []
    _.forEach(users, user => addOrUpdate.push({ user_uuid: user.uuid }))
    await this.addOrUpdArray(addOrUpdate)
  }

  incrementChatStats (user, msg) {
    const total_lines = user.total_lines + 1
    const total_chars = user.total_chars + msg.length
    const chars_per_line = Math.floor(total_chars / total_lines)

    const updateStats = {
      total_lines,
      total_chars,
      chars_per_line,
      timestampLastChatLine: this.helpers.date.timestamp(),
    }

    return this.updAllWhere({ user_uuid: user.uuid }, updateStats)
  }

  async incrementSeenStats (users, chatters) {
    const { helpers: h } = this
    const currTimestamp = h.date.timestamp()

    await Promise.each(users, async user => {
      const count_seen = _.get(chatters, `${user.username}.count_seen`, 0)
      let label = 'chat_seen_normal'
      if (user.isFollower === 'yes') { label = 'chat_seen_follower' }
      if (user.isSubscriber === 'yes') { label = 'chat_seen_subscriber' }

      if (user.timestampExtensionUntill >= currTimestamp) {
        label.replace('chat', 'extension')
      }

      await this.incrementAllWhere({ user_uuid: user.uuid }, {
        [label]: count_seen,
      })

    }, { concurrency: 3 })

  }

}
