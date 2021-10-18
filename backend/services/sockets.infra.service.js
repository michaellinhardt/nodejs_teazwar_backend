import _ from 'lodash'
import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'sockets_infra'

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources) }

  connected (infra_name, socket_id) {
    return this.updAllWhere({ infra_name }, { socket_id })
  }

  disconnected (socket_id) {
    return this.updAllWhere({ socket_id }, { socket_id: null })
  }

  disconnectedByName (infra_name) {
    return this.updAllWhere({ infra_name }, { socket_id: null })
  }

  getByName (infra_name) {
    return this.getFirstWhere({ infra_name })
  }

  async buildEmitSayArray (infra_name) {
    const { socket_id = null } = await this.getByName(infra_name)
    const isEmit = _.get(this, 'payload.emit[1]', undefined)
    if (!isEmit) {
      this.payload.emit = [socket_id, {
        say: [],
      }]

    } else {
      this.payload.emit[0] = socket_id
      const isSay = _.get(this, 'payload.emit[1].say', undefined)
      if (!isSay) { this.payload.emit[1].say = [] }
    }
  }

  pushToEmitSay (sayArray = null, isCondition = true) {
    if (!isCondition) { return false }
    const isEmitSay = _.get(this, 'payload.emit[1].say', undefined)
    if (!isEmitSay || !Array.isArray(isEmitSay) || !sayArray) { return false }
    this.payload.emit[1].say.push(sayArray)
  }

  async emitError (errorArray) {
    await this.buildEmitSayArray('discord')
    this.pushToEmitSay(errorArray)
  }

}
