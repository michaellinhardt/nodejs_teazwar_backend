import _ from 'lodash'

import ServiceSuperclass from '../application/superclass/service.superclass'

const { twitch, cron } = require('../../config')

const table = 'chatters'

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources) }

  extractChattersDataFromTwitchApi (chatters) {
    return _.get(chatters, 'chatters.broadcaster', [])
      .concat(_.get(chatters, 'chatters.vips', []))
      .concat(_.get(chatters, 'chatters.moderators', []))
      .concat(_.get(chatters, 'chatters.staff', []))
      .concat(_.get(chatters, 'chatters.admins', []))
      .concat(_.get(chatters, 'chatters.global_mods', []))
      .concat(_.get(chatters, 'chatters.viewers', []))
  }

  setUsersAsValidated (users) {
    const currTimestampMs = this.helpers.date.timestampMs()
    const tsuTwitchDataUpToDate = currTimestampMs + cron.itvTwitchDataRevalidate
    const usernames = users.map(u => u.username)
    return this.updAllWhereIn('username', usernames, { tsuTwitchDataUpToDate })
  }

  async addOrIncrementCountSeen (chatter_list) {
    const chattersUsername = chatter_list.map(username => username.toLowerCase())
    const chattersDb = await this.getAllFirstWhereIn('username', chattersUsername)

    const addOrUpdArray = []
    _.forEach(chattersUsername, username => {
      const isDbChatter = chattersDb.find(c => c.username === username)
      const count_seen = isDbChatter ? isDbChatter.count_seen + 1 : 1
      const chatter = { username, count_seen }
      addOrUpdArray.push(chatter)
    })

    if (addOrUpdArray.length) {
      await this.addOrUpdArray(addOrUpdArray)
    }
  }

  getNextTwitchUpdateList () {
    const currTimestampMs = this.helpers.date.timestampMs()
    return this.knex()
      .where('count_seen', '>', 0)
      .andWhere('tsuTwitchDataUpToDate', '<', currTimestampMs)
      .orderBy('count_seen', 'desc')
      .limit(twitch.usersPerPage)
  }

  getNextXpGain () {
    const currTimestampMs = this.helpers.date.timestampMs()
    return this.knex()
      .where('count_seen', '>', 0)
      .andWhere('tsuTwitchDataUpToDate', '>=', currTimestampMs)
      .orderBy('count_seen', 'desc')
  }

  flattenChattersObject (chatters) {
    const chattersFlatten = {}
    _.forEach(chatters, c => {
      const username = c.username
      chattersFlatten[username] = c
    })
    return chattersFlatten
  }

  resetByUsernames (usernames) {
    return this.updAllWhereIn('username', usernames, { count_seen: 0 })
  }

}
