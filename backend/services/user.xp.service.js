import _ from 'lodash'
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

  getUsersRequiringLvlUp () {
    return this.knex()
      .whereRaw('?? >= ??', ['user_xp.level_xp', 'user_xp.level_xp_max'])
      .join('users', 'users.uuid', '=', 'user_xp.user_uuid')
  }

}
