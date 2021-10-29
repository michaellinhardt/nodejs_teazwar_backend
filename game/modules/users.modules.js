import ModuleSuperclass from '../superclass/module.superclass'

export default class extends ModuleSuperclass {

  async createByUsernames (usernames) {
    const twitchUsers = await this.apis.users.getByUsernames(usernames)
    return this.createByTwitchUsers(twitchUsers)

  }

  async createByUserIds (userIds) {
    const twitchUsers = await this.apis.users.getByUserIds(userIds)
    return this.createByTwitchUsers(twitchUsers)
  }

  async createByTwitchUsers (twitchUsers) {
    const { services: s } = this

    const users = await s.users.addOrUpdate(twitchUsers)
    const allUsers = users.added.concat(users.updated)

    await s.chatters.setUsersAsValidated(allUsers)

    await s.userXp.addMissingEntry(users.added)
    await s.userStats.addMissingEntry(users.added)
    await s.userAttributes.addMissingEntry(users.added)

    return users
  }

}
