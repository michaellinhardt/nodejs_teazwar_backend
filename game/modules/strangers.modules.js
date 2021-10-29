import _ from 'lodash'
import ModuleSuperclass from '../superclass/module.superclass'

export default class extends ModuleSuperclass {

  async addOrUpdStrangerFromData () {
    const { services: s, data: d, helpers: h, body: b } = this

    const opaque_user_id = _.get(d, 'jwtoken.opaque_user_id', undefined)
    const socket_id = _.get(b, 'big_data.socket.id', undefined)
    const jwtoken = _.get(d, 'jwtoken.token', undefined)

    const stranger = {
      opaque_user_id,
      jwtoken,
      socket_id,
      tslStrangerSeen: h.date.timestampMs(),
    }

    await s.strangers.addOrUpdOpaqueUser(stranger)

    return stranger
  }

}
