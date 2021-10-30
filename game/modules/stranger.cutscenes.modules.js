import ModuleSuperclass from '../superclass/module.superclass'

export default class extends ModuleSuperclass {

  filterCutsceneForUser (cutscene) {
    delete cutscene.id
    delete cutscene.tslCutsceneComplete
    delete cutscene.opaque_user_id
    return cutscene
  }

  async deleteStrangerCutscene (opaque_user_id) {
    const { services: s } = this

    const nbCutscenesDeleted = await s.strangerCutscenes.deleteByUserOpaqueId(opaque_user_id)

    return nbCutscenesDeleted
  }

  async deleteStrangerCutscenes (opaqueUserIds) {
    const { services: s } = this

    const nbCutscenesDeleted = await s.strangerCutscenes.deleteByUserOpaqueIds(opaqueUserIds)

    return nbCutscenesDeleted
  }

  async getDataCutscene (opaque_user_id) {
    const { services: s } = this

    const cutscene = await s.strangerCutscenes.getDataCutscene(opaque_user_id)

    return this.filterCutsceneForUser(cutscene)
  }

}
