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
      tslChatLine: this.helpers.date.timestampMs(),
    }

    return this.updAllWhere({ user_uuid: user.uuid }, updateStats)
  }

  async incrementSeenStats (users, chatters) {
    const { helpers: h } = this
    const currTimestampMs = h.date.timestampMs()

    const userStats = await this.getAllLastWhereIn('user_uuid', users.map(u => u.uuid))
    const updates = []

    _.forEach(users, user => {
      const count_seen = _.get(chatters, `${user.username}.count_seen`, 0)

      let label = 'chat_seen_normal'
      if (user.isFollower === 'yes') { label = 'chat_seen_follower' }
      if (user.isSubscriber === 'yes') { label = 'chat_seen_subscriber' }
      if (user.tsuOnlineExtension >= currTimestampMs) {
        label.replace('chat', 'extension')
      }

      const userStat = userStats.find(u => u.user_uuid === user.uuid)

      const update = _.pick(userStat, [
        'user_uuid',
        'chat_seen_normal',
        'chat_seen_follower',
        'chat_seen_subscriber',
        'extension_seen_normal',
        'extension_seen_follower',
        'extension_seen_subscriber',
      ])

      update[label] += count_seen

      updates.push(update)

    })

    await this.addOrUpdArray(updates)

  }

}
