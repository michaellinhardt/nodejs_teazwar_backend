import * as Promise from 'bluebird'
import _ from 'lodash'
const { xp } = require('../../config')

import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'sockets_infra'

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources) }

  async connected (infra_name, socket_id) {
    return this.updAllWhere({ infra_name }, { socket_id })
  }

  async disconnected (socket_id) {
    return this.updAllWhere({ socket_id }, { socket_id: null })
  }
}
