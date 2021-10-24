import _ from 'lodash'
import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'user_xp'
const isUuid = false

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources, isUuid) }

  async addMissingEntry (users) {
    const addOrUpdate = []
    _.forEach(users, user => addOrUpdate.push({ user_uuid: user.uuid }))
    await this.addOrUpdArray(addOrUpdate)
  }

  getUsersRequiringLvlUp () {
    return this.knex()
      .whereRaw('?? >= ??', ['user_xp.level_xp', 'user_xp.level_xp_max'])
      .join('users', 'users.uuid', '=', 'user_xp.user_uuid')
  }

}
