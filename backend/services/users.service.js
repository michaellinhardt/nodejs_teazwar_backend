import * as Promise from 'bluebird'
import _ from 'lodash'

import ServiceSuperclass from '../application/superclass/service.superclass'

const { twitch, cron } = require('../../config')
const table = 'users'

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources) }

  getChannel () {
    return this.getFirstWhere({ username: twitch.chatbot.channel })
  }

  async setOnline (chatter_list) {
    const { helpers: h } = this
    const timestampOnlineUntill = h.date.timestamp() + cron.viewerOnlineUntill
    return this.updAllWhereIn('username', chatter_list, { timestampOnlineUntill })
  }

  async getOneChatterNewFollower () {
    const { helpers: h } = this

    const currTimestamp = h.date.timestamp()

    const nextNewFollowCheck = await this.knex()
      .select('*')
      .where({ isDeleted: false })
      .andWhereNot('isFollower', 'yes')
      .andWhere('timestampOnlineUntill', '>=', currTimestamp)
      .andWhere('timestampNewFollowerCheck', '<=', currTimestamp)
      .orderBy('timestampNewFollowerCheck', 'asc')
      .first()
      // .andWhereNot('username', twitch.chatbot.channel)

    return nextNewFollowCheck
  }

  async getOneGlobalFollowing () {
    const { helpers: h } = this

    const currTimestamp = h.date.timestamp()

    const nextGlobalFollowingCheck = await this.knex()
      .select('*')
      .where({ isDeleted: false })
      .andWhere('timestampFollowingCheck', '<=', currTimestamp)
      .orderBy('timestampFollowingCheck', 'asc')
      .first()
      // .andWhereNot('username', twitch.chatbot.channel)

    return nextGlobalFollowingCheck
  }

  async getOneChatterUnFollower () {
    const { helpers: h } = this

    const currTimestamp = h.date.timestamp()

    const nextUnFollowCheck = await this.knex()
      .select('*')
      .where({ isDeleted: false })
      .andWhere('isFollower', 'yes')
      .andWhere('timestampOnlineUntill', '>=', currTimestamp)
      .andWhere('timestampUnFollowerCheck', '<=', currTimestamp)
      .orderBy('timestampUnFollowerCheck', 'asc')
      .first()
      // .andWhereNot('username', twitch.chatbot.channel)

    return nextUnFollowCheck
  }

  async updateFollowing (user, isFollowing) {
    const { helpers: h } = this
    const currTimestamp = h.date.timestamp()

    const isBotMultiplier = user.isBot === 'yes' ? cron.followingBotsMultiplier : 1
    const isFollower = isFollowing.length === 1 ? 'yes' : 'no'
    const countFollow = isFollowing.length === 1 ? user.countFollow + 1 : user.countFollow
    return this.updAllWhere({ uuid: user.uuid }, {
      isFollower,
      countFollow,
      timestampUnFollowerCheck: currTimestamp + (cron.chattersUnFollowerControlEvery * isBotMultiplier),
      timestampNewFollowerCheck: currTimestamp + (cron.chattersNewFollowerControlEvery * isBotMultiplier),
      timestampFollowingCheck: currTimestamp + (cron.globalFollowingControlEvery * isBotMultiplier),
    })
  }

  async tagBots (botsList) {
    const botUsernames = botsList.map(b => b[0])

    const botUsers = await this.knex()
      .select('*')
      .whereIn('username', botUsernames)
      .andWhere({
        isDeleted: false,
        isBot: 'maybe',
      })

    const dbBotUsernames = botUsers.map(b => b.username)

    await this.updAllWhereIn('username', dbBotUsernames, { isBot: 'yes' })

    return botUsers
  }

  async getByUserId (user_id) {
    const user = await this.knex()
      .select('*')
      .where('users.isDeleted', false)
      .andWhere('users.user_id', user_id)
      .join('user_chat', 'users.uuid', '=', 'user_chat.user_uuid')
      .join('user_xp', 'users.uuid', '=', 'user_xp.user_uuid')
      .first()
    if (user) { user.uuid = user.user_uuid }
    return user
  }

  async addOrUpdate (twitchUsers) {
    const userIds = twitchUsers.map(t => t.id)
    const existingUsers = await this.getAllFirstWhereIn('user_id', userIds)

    const updates = []
    const adds = []

    _.forEach(twitchUsers, twitchUser => {
      const user = {
        user_id: twitchUser.id,
        username: twitchUser.login,
        display_name: twitchUser.display_name,
        type: twitchUser.type,
        broadcaster_type: twitchUser.broadcaster_type,
        description: twitchUser.description,
        avatar_url: twitchUser.profile_image_url,
        view_count: twitchUser.view_count,
        twitch_created_at: twitchUser.created_at,
        isFollower: 'maybe',
        isSubscriber: 'maybe',
        isBot: 'maybe',
      }

      const isExisting = existingUsers.find(e => e.user_id === twitchUser.id)

      if (isExisting) {
        user.isBot = isExisting.isBot
        user.isFollower = isExisting.isFollower
        user.isSubscriber = isExisting.isSubscriber
        user.uuid = isExisting.uuid
        updates.push(user)

      } else { adds.push(user) }
    })

    let added = []
    if (adds.length) {
      added = await this.addArray(adds)
    }
    
    if (updates.length) {
      await Promise.each(updates, async user => {
        await this.updAllWhere({user_id: user.user_id}, user)
      }, { concurrency: 3 })
    }

    return { added, updated: updates }

  }

}