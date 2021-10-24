import _ from 'lodash'
import ModuleSuperclass from '../superclass/module.superclass'

export default class extends ModuleSuperclass {

  async increaseOneLevelForUsers () {
    const users_xp = await this.services.userXp.getUsersRequiringLvlUp()
    if (users_xp.length === 0) { return [] }

    const updates = []
    _.forEach(users_xp, user_xp => {
      updates.push({
        level: user_xp.level + 1,
        level_xp: user_xp.level_xp - user_xp.level_xp_max,
        level_xp_max: this._xpMaxPerLevel(user_xp.level + 1),
        user_uuid: user_xp.user_uuid,
      })
    })

    await this.services.userXp.addOrUpdArray(updates)
    return users_xp
  }

  async addXpForChatline (user, tslXpChatLineOld, tslXpChatLineNew) {
    const { config: c, services: s } = this

    const tsBetweenChatlines = tslXpChatLineNew - tslXpChatLineOld
    if (tsBetweenChatlines < c.xp.itvPerChatLine) { return false }

    await s.userXp.addXpFromChatLine(tslXpChatLineNew)
    await s.userXp.setLastXpChatLine(user, tslXpChatLineNew)

    return true
  }

  async addXpGainToChatters (users, chattersFlatten) {
    const { services: s, config: { xp } } = this

    const xpbonus_perma_group = await s.config.get('xpbonus_perma_group')

    const updates = []
    _.forEach(users, user => {
      const xpbonus_perma_self = this._getUserBonusPermaSelf(user)
      const xpbonus_perma_total = xpbonus_perma_group + xpbonus_perma_self
      const xpbonus_perma_real_value = xp.xpPerMin * (xpbonus_perma_total / 100)

      const userXpPerMin = xp.xpPerMin + xpbonus_perma_real_value

      const count_seen = _.get(chattersFlatten, `${user.username}.count_seen`, 0)
      const xpGain = count_seen * userXpPerMin

      updates.push({ user_uuid: user.uuid, level_xp: user.level_xp + xpGain })
    })

    await this.services.userXp.addOrUpdArray(updates)
  }

  async calculateBonusPermaGroup () {
    const { services: s, config: { xp } } = this

    const extensionUsers = await s.users.getExtensionUsers()

    const xpbonus_perma_group_details = {
      follower: 0,
      subscriber: 0,
      discord: 0,
    }
    _.forEach(extensionUsers, user => {
      xpbonus_perma_group_details.follower += user.isFollower === 'yes' ? 1 : 0
      xpbonus_perma_group_details.subscriber += user.isSubscriber === 'yes' ? 1 : 0
      xpbonus_perma_group_details.discord += user.discord_id ? 1 : 0
    })

    const xpbonus_perma_group = 0
      + (xpbonus_perma_group_details.follower * xp.follower.group)
      + (xpbonus_perma_group_details.subscriber * xp.subscriber.group)
      + (xpbonus_perma_group_details.discord * xp.discord.group)

    await s.config.sets({ xpbonus_perma_group, xpbonus_perma_group_details })

    return { xpbonus_perma_group_details, xpbonus_perma_group }
  }

  _getUserBonusPermaSelf (user) {
    const { config: { xp } } = this
    return (user.isFollower === 'yes' ? xp.follower.self : 0)
      + (user.isSubscriber === 'yes' ? xp.subscriber.self : 0)
      + (user.discord_id ? xp.discord.self : 0)
  }

  _xpMaxPerLevel (level) {
    const { config: { xp } } = this
    return parseInt(xp.xpMaxMinimum + (level * 100 * (level / 10)), 10)
  }

}
