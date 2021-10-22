import * as Promise from 'bluebird'
import _ from 'lodash'
import ModuleSuperclass from '../superclass/module.superclass'

export default class extends ModuleSuperclass {

  async increaseOneLevelForUsers () {
    const users_xp = await this.services.userXp.getUsersRequiringLvlUp()
    if (users_xp.length === 0) { return [] }
    await Promise.each(users_xp, user_xp => {
      user_xp.level += 1
      user_xp.level_xp -= user_xp.level_xp_max
      user_xp.level_xp_max = this._xpMaxPerLevel(user_xp.level + 1)

      const update = _.pick(user_xp, [
        'level', 'level_xp', 'level_xp_max'])

      return this.services.userXp
        .updAllWhere({ user_uuid: user_xp.user_uuid }, update)
    }, { concurrency: 3 })
    return users_xp
  }

  async addXpGainToChatters (users, chattersFlatten) {
    const { services: s } = this

    const xpbonus_perma_group = await s.config.get('xpbonus_perma_group')

    await Promise.each(users, user => {
      const xpPerMin = this._getUserXpPerMin(xpbonus_perma_group, user)
      const count_seen = _.get(chattersFlatten, `${user.username}.count_seen`, 0)
      const xpGain = count_seen * xpPerMin

      return this.services.userXp.incrementAllWhere(
        { user_uuid: user.uuid }, { level_xp: xpGain })
    }, { concurrency: 3 })
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

  _getUserXpPerMin (xpbonus_perma_group, user) {
    const { config: { xp } } = this

    const xpbonus_perma_self = this._getUserBonusPermaSelf(user)
    const xpbonus_perma_total = xpbonus_perma_group + xpbonus_perma_self
    const xp_perma_total = xp.xpPerMin * (xpbonus_perma_total / 100)

    return xp_perma_total
  }

  _xpMaxPerLevel (level) {
    const { config: { xp } } = this
    return parseInt(xp.xpMaxMinimum + (level * 100 * (level / 10)), 10)
  }

}
