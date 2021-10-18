import _ from 'lodash'
import PayloadSuperclass from '../application/superclass/payload.superclass'

const payloadHeader = 'cron'

export default class extends PayloadSuperclass {

  constructor (ressources) { super(ressources, payloadHeader) }

  blacklistProperties () { return [] }

  empty (payload = {}) {
    _.merge(this.payload, payload, { success: true, empty: true })
  }

  success (payload = {}) {
    _.merge(this.payload, payload, { success: true, empty: false })
    this.payload.success = true
    this.payload.empty = false
  }

  error (payload = {}) {
    _.merge(this.payload, payload, { success: false, empty: false })
  }

}
