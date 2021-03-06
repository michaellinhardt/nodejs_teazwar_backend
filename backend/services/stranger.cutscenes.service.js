import _ from 'lodash'
import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'stranger_cutscenes'
const uuid_field = false

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources, uuid_field) }

  addCutscene (cutscene_id) {
    const opaque_user_id = _.get(this, 'data.jwtoken.opaque_user_id', undefined)

    const strangerCutscene = {
      opaque_user_id,
      cutscene_id,
    }

    return this.add(strangerCutscene)
  }

  deleteByUserOpaqueId (opaque_user_id) {
    return this.delAllWhere({ opaque_user_id })
  }

  deleteByUserOpaqueIds (opaqueUserIds) {
    return this.delAllWhereIn('opaque_user_id', opaqueUserIds)
  }

  getDataCutscene (opaque_user_id) {
    return this.getFirstWhere({
      opaque_user_id,
      tslCutsceneComplete: 0,
    })
  }

}
