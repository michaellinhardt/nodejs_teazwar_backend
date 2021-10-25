import _ from 'lodash'

export default class {

  constructor (ressources) {
    this.build_ressources(ressources)
    this.ressources = ressources
  }

  build_ressources (ressources) {
    _.forEach(ressources, (ressource, name) => { this[name] = ressource })
  }

  StopPipeline (error_key = 'unknow_error') {
    this.payload.error_key = error_key
    throw new this.renders.StopPipeline(error_key)
  }

}
