import ModuleSuperclass from '../superclass/module.superclass'

export default class extends ModuleSuperclass {

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

}
