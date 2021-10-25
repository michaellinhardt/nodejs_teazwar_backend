const Promise = require('bluebird')
// import _ from 'lodash'
import ModuleSuperclass from '../superclass/module.superclass'

export default class extends ModuleSuperclass {

  async create (aura_id, params) {
    const auraInstance = this.getInstanceById(aura_id, { params })
    const auraDb = await auraInstance.create()
    await auraInstance.onCreate()
    return auraDb
  }

  getInstanceById (aura_id, properties = {}) {
    const { helpers: h, config: { auras: { layout } } } = this
    const aura = layout.byId[aura_id]
    const auraClassName = h.string.camelCaseString(aura.aura_class, '_')
    const auraInstance = new this.auras[auraClassName]({
      ...this.ressources,
      layout: {
        aura_id,
        ...aura,
        params: undefined,
      },
      params: {
        ...(aura.params || {}),
        ...(properties.params || {}),
      },
      database: (properties.database || {}),
    })
    return auraInstance
  }

  async deleteUserAurasById (user_uuid, aura_id) {
    const { services: s } = this
    const auras = await this.getUserInstancesById(user_uuid, aura_id)
    await Promise.map(auras, aura => aura.onDelete(), { concurrency: 1 })
    const nbDeleted = await s.auras.delUserAurasById(user_uuid, aura_id)
    return nbDeleted
  }

  async getInstancesByClass (aura_class) {
    const { services: s } = this
    const aurasDb = await s.auras.getAurasByClass(aura_class)
    const auraInstances = aurasDb.map(auraDb => this.getInstanceById(auraDb.aura_id, {
      database: auraDb,
    }))
    return auraInstances
  }

  async getInstancesById (aura_id) {
    const { services: s } = this
    const aurasDb = await s.auras.getAurasById(aura_id)
    const auraInstances = aurasDb.map(auraDb => this.getInstanceById(auraDb.aura_id, {
      database: auraDb,
    }))
    return auraInstances
  }

  async getUserInstancesById (user_uuid, aura_id) {
    const { services: s } = this
    const aurasDb = await s.auras.getUserAurasById(user_uuid, aura_id)
    const auraInstances = aurasDb.map(auraDb => this.getInstanceById(auraDb.aura_id, {
      database: auraDb,
    }))
    return auraInstances
  }

}
