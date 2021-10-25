import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'auras'
const uuid_field = 'aura_uuid'

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources, uuid_field) }

  getAurasByClass (auraClass) {
    const { config: { auras } } = this

    const currTimestampMs = this.helpers.date.timestampMs()

    return this.knex()
      .join('users', 'users.user_uuid', '=', 'auras.owner_uuid')
      .whereIn('aura_id', auras.layout.idsByClass[auraClass])
      .andWhere('tsuOnlineExtension', '>', currTimestampMs)
      .andWhere((knex) => {
        knex
          .where({ tic: -1, tsuActive: -1 })
          .orWhere('tic', '>', 0)
          .orWhere('tsuActive', '>', 0)
      })
  }

  getAurasById (aura_id) {
    const currTimestampMs = this.helpers.date.timestampMs()
    return this.knex()
      .join('users', 'users.user_uuid', '=', 'auras.owner_uuid')
      .where('tsuOnlineExtension', '>', currTimestampMs)
      .andWhere({ aura_id })
      .andWhere((knex) => {
        knex
          .where({ tic: -1, tsuActive: -1 })
          .orWhere('tic', '>', 0)
          .orWhere('tsuActive', '>', 0)
      })
  }

  getUserAurasById (owner_uuid, aura_id) {
    const currTimestampMs = this.helpers.date.timestampMs()
    return this.knex()
      .join('users', 'users.user_uuid', '=', 'auras.owner_uuid')
      .where('tsuOnlineExtension', '>', currTimestampMs)
      .andWhere({ aura_id, owner_uuid })
      .andWhere((knex) => {
        knex
          .where({ tic: -1, tsuActive: -1 })
          .orWhere('tic', '>', 0)
          .orWhere('tsuActive', '>', 0)
      })
  }

  delUserAurasById (owner_uuid, aura_id) {
    return this.knex()
      .where({ aura_id, owner_uuid })
      .del()
  }

  cleanTable () {
    return this.knex()
      .where({ tic: 0, tsuActive: 0 })
      .orWhere({ tic: -1, tsuActive: 0 })
      .orWhere({ tic: 0, tsuActive: -1 })
      .del()
  }

}
