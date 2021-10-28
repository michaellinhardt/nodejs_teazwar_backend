import _ from 'lodash'
import PayloadSuperclass from '../application/superclass/payload.superclass'

const payloadHeader = 'user'

export default class extends PayloadSuperclass {

  constructor (ressources) { super(ressources, payloadHeader) }

  blacklistProperties () { return [] }

  authSuccess () {
    const { data: d } = this
    _.merge(this.payload, { jwtoken: d.jwtoken.token })
  }

  authFail () { _.merge(this.payload, { error_key: 'jwtoken_fail' }) }

}
