import PayloadSuperclass from '../application/superclass/payload.superclass'

const payloadHeader = 'cron'

export default class extends PayloadSuperclass {

  constructor (ressources) { super(ressources, payloadHeader) }

  blacklistProperties () { return [] }

  empty (payload = {}) {
    return { ...payload, success: true, empty: true }
  }

  success (payload = {}) {
    return { ...payload, success: true, empty: false }
  }

  error (payload = {}) {
    return { ...payload, success: false, empty: false }
  }

}
