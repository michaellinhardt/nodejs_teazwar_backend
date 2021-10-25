import _ from 'lodash'
import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'user_xp'
const uuid_field = false

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources, uuid_field) }

  async addMissingEntry (users) {
    const addOrUpdate = []
    _.forEach(users, user => addOrUpdate.push({ user_uuid: user.user_uuid }))
    await this.addOrUpdArray(addOrUpdate)
  }

  getUsersRequiringLvlUp () {
    return this.knex()
      .whereRaw('?? >= ??', ['user_xp.level_xp', 'user_xp.level_xp_max'])
      .join('users', 'users.user_uuid', '=', 'user_xp.user_uuid')
  }

  setLastXpChatLine (user, timestampMs = null) {
    const tslXpChatLine = timestampMs ? timestampMs : this.herlpers.date.timestampMs()
    return this.updAllWhere({ user_uuid: user.user_uuid }, { tslXpChatLine })
  }

  addXpFromChatLine (timestampMs = null) {
    const currTimestampMs = timestampMs ? timestampMs : this.herlpers.date.timestampMs()
    const knex = this.helpers.knex.get()
    return knex.raw(`
      UPDATE user_xp
      INNER JOIN users on
          users.user_uuid = user_xp.user_uuid
      SET
        user_xp.level_xp = user_xp.level_xp + ?
      WHERE users.tsuOnlineTchat > ?
      `,
    [
      this.config.xp.xpPerChatLine,
      currTimestampMs,
    ])
  }

}
