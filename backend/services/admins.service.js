import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'admins'

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources) }

}
