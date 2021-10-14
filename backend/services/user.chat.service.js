import _ from 'lodash'

import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'user_chat'

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

  async incrementStats(user, msg) {
    const total_lines = user.total_lines + 1
    const total_chars = user.total_chars + msg.length
    const chars_per_line = Math.floor(total_chars / total_lines)

    const updateStats = {
      total_lines,
      total_chars,
      chars_per_line,
      timestampLastLine: this.helpers.date.timestamp(),
    }

    return this.updAllWhere({ user_uuid: user.uuid }, updateStats)
  }

}