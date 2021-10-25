import _ from 'lodash'

import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'user_attributes'
const uuid_field = false

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources, uuid_field) }

  async addMissingEntry (users) {
    const addOrUpdate = []
    _.forEach(users, user => addOrUpdate.push({ user_uuid: user.user_uuid }))
    await this.addOrUpdArray(addOrUpdate)
  }

}
