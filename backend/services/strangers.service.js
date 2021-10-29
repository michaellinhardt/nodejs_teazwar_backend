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

  getByOpaqueUserId (opaque_user_id) {
    return this.getFirstWhere({ opaque_user_id })
  }

  disconnectedSocket (opaque_user_id) {
    return this.updAllWhere({ opaque_user_id }, { socket_id: null })
  }

  getOutdatedStrangers () {
    const currTimestampMs = this.helpers.date.timestampMs()
    const expireAfterTimestamp = currTimestampMs - this.config.cron.itvStrangerDelete
    return this.knex()
      .select('*')
      .where('tslStrangerSeen', '<=', expireAfterTimestamp)
  }

  deleteByUserOpaqueIds (opaqueUserIds) {
    return this.knex()
      .select('*')
      .whereIn('opaque_user_id', opaqueUserIds)
      .del()
  }

}
