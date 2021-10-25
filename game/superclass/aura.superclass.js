import _ from 'lodash'

export default class {

  constructor (ressources) {
    this.build_ressources(ressources)
  }

  build_ressources (ressources) {
    _.forEach(ressources, (ressource, name) => { this[name] = ressource })
  }

  StopPipeline (error_key = 'unknow_error') {
    this.payload.error_key = error_key
    throw new this.renders.StopPipeline(error_key)
  }

  onDelete () { return true }

  async create () {
    const {
      services: s,
      layout: { aura_id, itvTic, ticTotal, tsuActive },
      params: { owner_uuid, target_uuid },
    } = this

    const tsnTic = !itvTic ? -1 : this.helpers.date.timestampMs()

    const auraDb = await s.auras.add({
      owner_uuid,
      aura_id,
      target_uuid,
      tic: ticTotal,
      tsnTic,
      tsuActive,
    })

    this.database = auraDb

    return this.database
  }

}
