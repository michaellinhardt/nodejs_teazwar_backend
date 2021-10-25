import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'bots'
const uuid_field = false

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources, uuid_field) }

  addMissing (apiUsernames, dbUsernames) {

    const newBots = apiUsernames.filter(api =>
      !dbUsernames.find(db => db.username === api.username))

    return newBots.length ? this.addArray(newBots) : []
  }

  deleteMissing (apiUsernames, dbUsernames) {
    const deleteBotUsernames = dbUsernames.filter(db =>
      !apiUsernames.find(api => db.username === api.username))
      .map(b => b.username)

    return deleteBotUsernames.length
      ? this.delAllWhereIn('username', deleteBotUsernames) : []
  }

  getByUsername (username) {
    return this.getFirstWhere({ username })
  }

}
