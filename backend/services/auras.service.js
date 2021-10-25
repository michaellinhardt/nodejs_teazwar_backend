import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'auras'
const isUuid = true

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources, isUuid) }

  async getAurasByClass (auraClass) {
    const { config: { auras } } = this

    await this.knex()
      .whereIn('aura_id', auras.layout.idsByClass[auraClass])
      .andWhere((knex) => {
        knex
          .where({ tic: -1, tsuActive: -1 })
          .orWhere('tic', '>', 0)
          .orWhere('tsuActive', '>', 0)
      })
  }

  getUserAurasById (owner_uuid, aura_id) {
    return this.knex()
      .where({ aura_id, owner_uuid })
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
