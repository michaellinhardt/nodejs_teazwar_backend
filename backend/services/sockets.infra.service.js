import _ from 'lodash'
import ServiceSuperclass from '../application/superclass/service.superclass'

const table = null

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources) }

  async connected (infra_name, socket_id) {
    const { socketIds } = await this.redis.get('socketIds')
    _.set(socketIds, infra_name, { infra_name, socket_id })
    await this.redis.set({ socketIds })
    return socketIds[infra_name]
  }

  async disconnected (socket_id) {
    const { socketIds } = await this.redis.get('socketIds')
    let thisSocket = null
    _.forEach(socketIds, socket => {
      if (socket.socket_id === socket_id) {
        thisSocket = socket
        thisSocket.socket_id = null
        return false
      }
    })
    await this.redis.set({ socketIds })
    return thisSocket
  }

  async disconnectedByName (infra_name) {
    const { socketIds } = await this.redis.get('socketIds')
    socketIds[infra_name] = { infra_name, socket_id: null }
    await this.redis.set({ socketIds })
    return socketIds[infra_name]
  }

  async getByName (infra_name) {
    const { socketIds } = await this.redis.get('socketIds')
    const socket = _.get(socketIds, infra_name, { infra_name, socket_id: null })
    _.set(this, `payload.socketIds.${infra_name}`, socket.socket_id)
    return socket
  }

  async getById (socket_id) {
    const { socketIds } = await this.redis.get('socketIds')
    let socket = null
    _.forEach(socketIds, socketId => {
      if (socketId.socket_id === socket_id) { socket = socketId }
    })
    if (socket) {
      _.set(this, `payload.socketIds.${socket.infra_name}`, socket.socket_id)
    }
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
