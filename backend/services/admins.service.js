import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'admins'
const uuid_field = false

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources, uuid_field) }

}
