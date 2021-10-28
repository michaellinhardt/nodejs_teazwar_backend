import _ from 'lodash'

import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'strangers'
const uuid_field = false

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources, uuid_field) }

  async addOrUpdOpaqueUser (opaque_user_id, jwtoken, socket_id) {
    await this.helpers.knex.get().raw(`
    INSERT INTO ${table} (opaque_user_id, jwtoken, socket_id)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
      jwtoken=VALUES(?),
      socket_id=VALUES(?);
  `, [opaque_user_id, jwtoken, socket_id, jwtoken, socket_id])
    return { opaque_user_id, jwtoken, socket_id }
  }

}
