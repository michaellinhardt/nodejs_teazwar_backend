import ModuleSuperclass from '../superclass/module.superclass'

export default class extends ModuleSuperclass {

  async increaseOneLevelForUsers () {
    const { services: s } = this

    const requireLevelUp = await s.userXp.getUsersRequiringLvlUp()

    if (requireLevelUp.length === 0) { return [] }

    const updated = await s.userXp.increaseOneLevelForUsers(requireLevelUp)

    return updated

  }

}
