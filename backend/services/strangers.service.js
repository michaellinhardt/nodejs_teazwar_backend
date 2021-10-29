import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'strangers'
const uuid_field = false

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources, uuid_field) }

  addOrUpdOpaqueUser (stranger) {
    return this.addOrUpd(stranger)
  }

  getBySocketId (socket_id) {
    return this.getFirstWhere({ socket_id })
  }

  disconnectedSocket (opaque_user_id) {
    return this.updAllWhere({ opaque_user_id }, { socket_id: null })
  }

  cleanTable () {
    const currTimestampMs = this.helpers.date.timestampMs()
    const expireAfterTimestamp = currTimestampMs - this.config.cron.itvStrangerDelete
    return this.knex()
      .where('tslStrangerSeen', '<=', expireAfterTimestamp)
      .del()
  }

}
