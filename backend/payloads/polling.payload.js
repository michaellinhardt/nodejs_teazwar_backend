import _ from 'lodash'
import PayloadSuperclass from '../application/superclass/payload.superclass'

const payloadHeader = 'rooms'

export default class extends PayloadSuperclass {

  constructor (ressources) { super(ressources, payloadHeader) }

  blacklistProperties () {
    return [ 'jwtoken' ]
  }

  async pollingDiscord (isEvent) {
    return { event: isEvent } || {}
  }

  async pollingTwitch (isEvent) {
    return { event: isEvent } || {}
  }

}