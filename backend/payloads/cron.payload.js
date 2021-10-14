import _ from 'lodash'
import PayloadSuperclass from '../application/superclass/payload.superclass'

const payloadHeader = 'rooms'

export default class extends PayloadSuperclass {

  constructor (ressources) { super(ressources, payloadHeader) }

  blacklistProperties () {
    return [
      'jwtoken',
    ]
  }

  empty () {
    return { success: true, empty: true }
  }

  success () {
    return { success: true, empty: false }
  }

  error () {
    return { success: false, empty: false }
  }

}