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

  async getByName (infra_name) {
    const socket = await this.getFirstWhere({ infra_name })
    _.set(this, `payload.socketIds.${infra_name}`, socket.socket_id)
    return socket
  }

  async getById (socket_id) {
    const socket = await this.getFirstWhere({ socket_id })
    _.set(this, `payload.socketIds.${socket.infra_name}`, socket.socket_id)
    return socket
  }

  async buildSayArray (infra_name) {
    const isSay = _.get(this, `payload.say.${infra_name}`, undefined)
    if (isSay && Array.isArray(isSay)) { return true }

    _.set(this, `payload.say.${infra_name}`, [])
    await this.getByName(infra_name)
  }

  async emitSay (infra_name, sayArray = null, isCondition = true) {
    if (!isCondition) { return false }
    await this.buildSayArray(infra_name)
    this.payload.say[infra_name].push(sayArray)
  }

  emitSayDiscord (sayArray = null, isCondition = true) {
    return this.emitSay('discord', sayArray, isCondition)
  }

  emitSayTwitch (sayArray = null, isCondition = true) {
    return this.emitSay('twitch', sayArray, isCondition)
  }

  async emitError (errorArray) {
    await this.emitSayDiscord(errorArray)
  }

}
