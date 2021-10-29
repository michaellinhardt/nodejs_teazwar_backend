import _ from 'lodash'

import ServiceSuperclass from '../application/superclass/service.superclass'

const { twitch, cron } = require('../../config')
const table = 'users'
const uuid_field = 'user_uuid'

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources, uuid_field) }

  getOnlineBots () {
    const currTimestampMs = this.helpers.date.timestampMs()
    return this.knex()
      .select('*')
      .where('isBot', 'yes')
      .andWhere('tsuOnlineTchat', '>=', currTimestampMs)
  }

  // TODO: when extension timestamp exist, replace this
  getExtensionUsers () {
    const currTimestampMs = this.helpers.date.timestampMs()
    return this.knex()
      .select('*')
      .where('tsuOnlineTchat', '>=', currTimestampMs)
      // .andWhere('tsuOnlineExtension', '>=', currTimestampMs)
  }

  getChannel () {
    return this.getFirstWhere({ username: twitch.chatbot.channel })
  }

  async getFullByUsernames (usernames) {
    const user = await this.knex()
      .select('*')
      .whereIn('username', usernames)
      .join('user_xp', 'users.user_uuid', '=', 'user_xp.user_uuid')
      .join('user_stats', 'users.user_uuid', '=', 'user_stats.user_uuid')
      .join('user_attributes', 'users.user_uuid', '=', 'user_attributes.user_uuid')
    return user
  }

  setJwtokenByUserUuid (user_uuid, jwtoken) {
    return this.setJwtoken({ user_uuid }, jwtoken)
  }

  setJwtokenByUserId (user_id, jwtoken, socket_id) {
    return this.setJwtoken({ user_id }, jwtoken, socket_id)
  }

  disconnectedSocket (user_uuid) {
    return this.updAllWhere({ user_uuid }, { socket_id: null })
  }

  setJwtoken (where, jwtoken, socket_id = '') {
    const currTimestampMs = this.helpers.date.timestampMs()
    const tsuOnlineExtension = currTimestampMs + cron.itvOnlineExtension
    const tsuOnlineTchat = currTimestampMs + cron.itvOnlineTchat
    return this.updAllWhere(where, {
      jwtoken,
      tsuOnlineExtension,
      tsuOnlineTchat,
      socket_id,
    })
  }

  getBySocketId (socket_id) {
    return this.getFirstWhere({ socket_id })
  }

  getByUsernames (usernames) {
    return this.getAllFirstWhereIn('username', usernames)
  }

  setOnlineExtension (user_id) {
    const { helpers: h } = this
    const currTimestampMs = h.date.timestampMs()
    const tsuOnlineExtension = currTimestampMs + cron.itvOnlineExtension
    const tsuOnlineTchat = currTimestampMs + cron.itvOnlineTchat
    return this.updAllWhere({ user_id }, {
      tsuOnlineExtension,
      tsuOnlineTchat,
    })
  }

  setOnlineTchat (chatter_list) {
    const { helpers: h } = this
    const tsuOnlineTchat = h.date.timestampMs() + cron.itvOnlineTchat
    return this.updAllWhereIn('username', chatter_list, { tsuOnlineTchat })
  }

  socketDisconnected (socket_id) {
    return this.updAllWhere({ socket_id }, { socket_id: null })
  }

  async getOneChatterNotFollowing () {
    const { helpers: h } = this

    const currTimestampMs = h.date.timestampMs()

    const nextNewFollowCheck = await this.knex()
      .select('*')
      .whereNot('isFollower', 'yes')
      .andWhere('tsuOnlineTchat', '>=', currTimestampMs)
      .andWhere('tsnCheckChatterNewFollower', '<=', currTimestampMs)
      .orderBy('tsnCheckChatterNewFollower', 'asc')
      .first()
      // .andWhereNot('username', twitch.chatbot.channel)

    return nextNewFollowCheck
  }

  async getOneChatterFollowing () {
    const { helpers: h } = this

    const currTimestampMs = h.date.timestampMs()

    const nextUnFollowCheck = await this.knex()
      .select('*')
      .where('isFollower', 'yes')
      .andWhere('tsuOnlineTchat', '>=', currTimestampMs)
      .andWhere('tsnCheckChatterUnFollow', '<=', currTimestampMs)
      .orderBy('tsnCheckChatterUnFollow', 'asc')
      .first()
      // .andWhereNot('username', twitch.chatbot.channel)

    return nextUnFollowCheck
  }

  updateFollowing (user, isFollowing) {
    const { helpers: h } = this
    const currTimestampMs = h.date.timestampMs()

    const isBotMultiplier = user.isBot === 'yes' ? cron.itvFollowingBotsMultiplier : 1
    const isFollower = isFollowing.length === 1 ? 'yes' : 'no'
    const countFollow = isFollowing.length === 1 ? user.countFollow + 1 : user.countFollow
    return this.updAllWhere({ user_uuid: user.user_uuid }, {
      isFollower,
      countFollow,
      tsnCheckChatterUnFollow: currTimestampMs
        + (cron.itvCheckChatterUnFollow * isBotMultiplier),
      tsnCheckChatterNewFollower: currTimestampMs
        + (cron.itvCheckChatterNewFollower * isBotMultiplier),
    })
  }

  async tagBots (dbBots) {
    const botUsernames = dbBots.map(b => b.username)

    const botUsers = await this.knex()
      .select('*')
      .whereIn('users.username', botUsernames)
      .andWhere({
        isBot: 'maybe',
      })

    const dbBotUsernames = botUsers.map(b => b.username)

    await this.updAllWhereIn('username', dbBotUsernames, { isBot: 'yes' })

    return botUsers
  }

  setDiscordIds (user, discord) {
    return this.updAllWhere({ user_uuid: user.user_uuid },
      { discord_id: discord.discord_id, guild_id: discord.guild_id })
  }

  async getByUserUuid (user_uuid) {
    const user = await this.knex()
      .select('*')
      .where('users.user_uuid', user_uuid)
      .first()
    return user
  }

  async getFullByUserId (user_id) {
    const user = await this.knex()
      .select('*')
      .where('users.user_id', user_id)
      .join('user_xp', 'users.user_uuid', '=', 'user_xp.user_uuid')
      .join('user_stats', 'users.user_uuid', '=', 'user_stats.user_uuid')
      .join('user_attributes', 'users.user_uuid', '=', 'user_attributes.user_uuid')
      .first()
    return user
  }

  async getByUserId (user_id) {
    const user = await this.knex()
      .select('*')
      .where('users.user_id', user_id)
      .first()
    return user
  }

  async getByUsername (username) {
    const user = await this.knex()
      .select('*')
      .where('users.username', username.toLowerCase())
      .first()
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
      }

      const isExisting = existingUsers.find(e => e.user_id === twitchUser.id)

      if (isExisting) {
        user.user_uuid = isExisting.user_uuid
        updates.push(user)

      } else {
        user.user_uuid = this.helpers.string.uuid()
        adds.push(user)
      }
    })

    const allUsers = adds.concat(updates)
    await this.addOrUpdArray(allUsers)

    return { added: adds, updated: updates }

  }

}
