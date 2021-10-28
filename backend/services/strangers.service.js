import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'strangers'
const uuid_field = false

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources, uuid_field) }

  async addOrUpdOpaqueUser (opaque_user_id, jwtoken, socket_id) {
    await this.helpers.knex.get().raw(`
    INSERT INTO ${table} (opaque_user_id, jwtoken, socket_id)
      VALUES (?, ?, ?) AS new
      ON DUPLICATE KEY UPDATE
      jwtoken=new.jwtoken,
      socket_id=new.socket_id;
  `, [opaque_user_id, jwtoken, socket_id])
    return { opaque_user_id, jwtoken, socket_id }
  }

  getBySocketId (socket_id) {
    return this.getFirstWhere({ socket_id })
  }

  disconnectedSocket (opaque_user_id) {
    return this.updAllWhere({ opaque_user_id }, { socket_id: null })
  }

}
