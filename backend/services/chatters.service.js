import _ from 'lodash'

import ServiceSuperclass from '../application/superclass/service.superclass'

const { twitch } = require('../../config')

const table = 'chatters'

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources) }

  getCountFromTwitch (chatters) {
    return _.get(chatters, 'chatter_count', 0)
  }

  getChattersFromTwitch (chatters) {
    return _.get(chatters, 'chatters.broadcaster', [])
      .concat(_.get(chatters, 'chatters.vips', []))
      .concat(_.get(chatters, 'chatters.moderators', []))
      .concat(_.get(chatters, 'chatters.staff', []))
      .concat(_.get(chatters, 'chatters.admins', []))
      .concat(_.get(chatters, 'chatters.global_mods', []))
      .concat(_.get(chatters, 'chatters.viewers', []))
  }

  async addOrIncrement(chatter_list) {
    const databaseChatters = await this.getAll()

    const chattersIncrement = []
    const chattersAdd = []

    _.forEach(chatter_list, username => {
      const formatedUsername = username.toLowerCase()
      const isChatters = databaseChatters.find(c => c.username === formatedUsername)
      return isChatters ? chattersIncrement.push(formatedUsername) : chattersAdd.push({ username: formatedUsername })
    })

    if (chattersAdd.length > 0) {
      await this.addArray(chattersAdd)
    }

    if (chattersIncrement.length > 0) {
      await this.incrementAllWhereIn('username', chattersIncrement, { count_seen: 1 })
    }
  }

  async getNextValidateList () {
    return this.knex()
      .where({ isDeleted: false })
      .andWhere('count_seen', '>', 0)
      .orderBy('count_seen', 'desc')
      .limit(twitch.usersPerPage)
  }

  async resetByUsernames (usernames) {
    return this.updAllWhereIn('username', usernames, { count_seen: 0 })
  }

}