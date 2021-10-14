import _ from 'lodash'

export default class {

  constructor (ressources) {
    this.table = null
    this.build_ressources(ressources)
  }

  setTable (table) {
    this.table = table
  }

  build_ressources (ressources) {
    _.forEach(ressources, (ressource, name) => {
      this[name] = ressource
    })
  }

  _knex () {
    if (!this.Knex) {
      this.Knex = this.helpers.knex.get()
    }
    return this.Knex(this.table)
  }

  _getLast () {
    return this.knex()
      .select('*')
      .where({ isDeleted: false })
      .orderBy('id', 'desc')
      .first()
  }

  _getLastWhere (where) {
    where.isDeleted = false
    return this.knex()
      .select('*')
      .where(where)
      .orderBy('id', 'desc')
      .first()
  }

  _getLastWhereOr (...args) {
    const request = this.knex()

    _.forEach(args, (where, index) => {
      const method = index > 0 ? 'orWhere' : 'where'
      request[method]({
        ...where,
        isDeleted: false,
      })
    })

    return request
      .select('*')
      .orderBy('id', 'desc')
      .first()
  }

  _getFirst () {
    return this.knex()
      .select('*')
      .where({ isDeleted: false })
      .first()
  }

  _getFirstWhere (where) {
    where.isDeleted = false
    return this.knex()
      .select('*')
      .where(where)
      .first()
  }

  _getFirstWhereOr (...args) {
    const request = this.knex()

    _.forEach(args, (where, index) => {
      const method = index > 0 ? 'orWhere' : 'where'
      request[method]({
        isDeleted: false,
        ...where,
      })
    })

    return request
      .select('*')
      .first()
  }

  _getAll () {
    return this.knex()
      .select('*')
      .where({ isDeleted: false })
  }

  _getAllFirstWhere (where) {
    where.isDeleted = false
    return this.knex()
      .select('*')
      .where(where)
  }

  _getAllLastWhere (where) {
    where.isDeleted = false
    return this.knex()
      .select('*')
      .where(where)
      .orderBy('id', 'desc')
  }

  _getAllLastWhereOr (...args) {
    const request = this.knex()

    _.forEach(args, (where, index) => {
      const method = index > 0 ? 'orWhere' : 'where'
      request[method]({
        isDeleted: false,
        ...where,
      })
    })

    return request
      .select('*')
      .orderBy('id', 'desc')
  }

  _getAllWhereOr (...args) {
    const request = this.knex()

    _.forEach(args, (where, index) => {
      const method = index > 0 ? 'orWhere' : 'where'
      request[method]({
        isDeleted: false,
        ...where,
      })
    })

    return request
      .select('*')
  }

  _getLastWhereIn (field, arrayValue) {
    return this.knex()
      .select('*')
      .whereIn(field, arrayValue)
      .andWhere({ isDeleted: false })
      .orderBy('id', 'desc')
      .first()
  }

  _getFirstWhereIn (field, arrayValue) {
    return this.knex()
      .select('*')
      .whereIn(field, arrayValue)
      .andWhere({ isDeleted: false })
      .first()
  }

  _getAllFirstWhereIn (field, arrayValue) {
    return this.knex()
      .select('*')
      .whereIn(field, arrayValue)
      .andWhere({ isDeleted: false })
  }

  _getAllLastWhereIn (field, arrayValue) {
    return this.knex()
      .select('*')
      .whereIn(field, arrayValue)
      .andWhere({ isDeleted: false })
      .orderBy('id', 'desc')
  }

  _decrementAllWhere (where, decrements) {
    where.isDeleted = false
    return this.knex()
      .decrement(decrements)
      .where(where)
  }

  _decrementAllWhereIn (field, arrayValue, decrements) {
    return this.knex()
      .decrement(decrements)
      .whereIn(field, arrayValue)
      .andWhere({ isDeleted: false })
  }

  _incrementAllWhere (where, increments) {
    where.isDeleted = false
    return this.knex()
      .increment(increments)
      .where(where)
  }

  _incrementAllWhereIn (field, arrayValue, increments) {
    return this.knex()
      .increment(increments)
      .whereIn(field, arrayValue)
      .andWhere({ isDeleted: false })
  }

  _updAllWhere (where, update) {
    where.isDeleted = false
    return this.knex()
      .update(update)
      .where(where)
  }

  _updAllWhereIn (field, arrayValue, update) {
    return this.knex()
      .update(update)
      .whereIn(field, arrayValue)
      .andWhere({ isDeleted: false })
  }

  _delAllWhere (where) {
    where.isDeleted = false
    return this.knex()
      .update({
        isDeleted: true,
        deleted_at: this.helpers.date.timestampSql(),
      })
      .where(where)
  }

  _delAllWhereIn (field, arrayValue) {
    return this.knex()
      .update({
        isDeleted: true,
        deleted_at: this.helpers.date.timestampSql(),
      })
      .whereIn(field, arrayValue)
      .andWhere({ isDeleted: false })
  }

  async _add (entry = {}) {
    entry.uuid = this.helpers.string.uuid()
    await this.knex().insert(entry)
    return entry
  }

  async _addArray (entries) {
    entries.forEach(entry => { entry.uuid = this.helpers.string.uuid() })
    await this.knex().insert(entries)
    return entries
  }

}
