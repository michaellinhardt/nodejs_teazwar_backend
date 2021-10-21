import _ from 'lodash'
import ServiceSuperclass from '../application/superclass/service.superclass'

const table = null

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources) }

  buildSayArray (infra_name) {
    const isSay = _.get(this, `payload.say.${infra_name}`, undefined)
    if (isSay && Array.isArray(isSay)) { return true }

    _.set(this, `payload.say.${infra_name}`, [])
  }

  emitSay (infra_name, sayArray = null, isCondition = true) {
    if (!isCondition) { return false }
    this.buildSayArray(infra_name)
    this.payload.say[infra_name].push(sayArray)
  }

  emitSayDiscord (sayArray = null, isCondition = true) {
    return this.emitSay('discord', sayArray, isCondition)
  }

  emitSayTwitch (sayArray = null, isCondition = true) {
    return this.emitSay('twitch', sayArray, isCondition)
  }

  emitError (errorArray) {
    this.emitSayDiscord(errorArray)
  }

}
