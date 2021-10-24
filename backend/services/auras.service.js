import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'auras'
const isUuid = true

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources, isUuid) }

}
