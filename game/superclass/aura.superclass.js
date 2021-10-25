import _ from 'lodash'

const sqlField = [
  'aura_uuid',
  'owner_uuid',
  'aura_id',
  'target_uuid',
  'tic',
  'tsnTic',
  'tsuActive',
]

export default class {

  constructor (ressources) {
    this.build_ressources(ressources)
  }

  build_ressources (ressources) {
    _.forEach(ressources, (ressource, name) => { this[name] = ressource })
    this.database = _.pick(this.database, sqlField)
  }

  StopPipeline (error_key = 'unknow_error') {
    this.payload.error_key = error_key
    throw new this.renders.StopPipeline(error_key)
  }

  onDelete () { return true }
  onCreate () { return true }

  getParam (key) { return this.params[key] }
  getLayout (key) { return this.layout[key] }
  getDatabase (key) { return this.database[key] }

  databaseDecrementTic (value) {
    if (!this.database || !this.database.aura_uuid) { return undefined }
    const decrementValue = this.database.tic - value
    const newTic = this.database.tic === -1
      ? -1
      : (decrementValue > -1 ? decrementValue : 0)
    return {
      ...this.database,
      tic: newTic,
    }
  }

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
