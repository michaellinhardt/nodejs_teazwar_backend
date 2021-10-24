import _ from 'lodash'

import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'user_attributes'
const isUuid = false

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources, isUuid) }

  async addMissingEntry (users) {
    const addOrUpdate = []
    _.forEach(users, user => addOrUpdate.push({ user_uuid: user.uuid }))
    await this.addOrUpdArray(addOrUpdate)
  }

}
