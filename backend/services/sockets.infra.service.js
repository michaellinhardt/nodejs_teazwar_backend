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

  getByName (infra_name) {
    return this.getFirstWhere({ infra_name })
  }
}
