import _ from 'lodash'

export default class {

  constructor (ressources) {
    this.table = null
    this.build_ressources(ressources)
  }

  setIsUuid (boolean) {
    this.isUuid = boolean
    this._isUuid = boolean
  }

  setTable (table) {
    this.table = table
    this._table = table
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
      .orderBy('id', 'desc')
      .first()
  }

  _getLastWhere (where) {
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
      .first()
  }

  _getFirstWhere (where) {
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
  }

  _getAllFirstWhere (where) {
    return this.knex()
      .select('*')
      .where(where)
  }

  _getAllLastWhere (where) {
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
      .orderBy('id', 'desc')
      .first()
  }

  _getFirstWhereIn (field, arrayValue) {
    return this.knex()
      .select('*')
      .whereIn(field, arrayValue)
      .first()
  }

  _getAllFirstWhereIn (field, arrayValue) {
    return this.knex()
      .select('*')
      .whereIn(field, arrayValue)
  }

  _getAllLastWhereIn (field, arrayValue) {
    return this.knex()
      .select('*')
      .whereIn(field, arrayValue)
      .orderBy('id', 'desc')
  }

  _decrementAllWhere (where, decrements) {
    return this.knex()
      .decrement(decrements)
      .where(where)
  }

  _decrementAllWhereIn (field, arrayValue, decrements) {
    return this.knex()
      .decrement(decrements)
      .whereIn(field, arrayValue)
  }

  _incrementAllWhere (where, increments) {
    return this.knex()
      .increment(increments)
      .where(where)
  }

  _incrementAllWhereIn (field, arrayValue, increments) {
    return this.knex()
      .increment(increments)
      .whereIn(field, arrayValue)
  }

  _updAllWhere (where, update) {
    return this.knex()
      .update(update)
      .where(where)
  }

  _addOrUpd (entry) {
    const knex = this.helpers.knex.get()

    const fields = []
    const valueBinds = []
    const valueString = []
    _.forEach(entry, (value, field) => {
      fields.push(field)
      valueBinds.push(value)
      valueString.push('?')
    })

    return knex.raw(`
    INSERT INTO ${this.table} (${fields.join(', ')})
      VALUES (${valueString.join(', ')})
      ON DUPLICATE KEY UPDATE
      ${fields.map(f => `${f}=VALUES(${f})`).join(', ')}
  `, valueBinds)
  }

  _addOrUpdArray (entryArray) {
    const knex = this.helpers.knex.get()

    const fields = []
    _.forEach(entryArray, entry => {

      _.forEach(entry, (value, field) => {
        if (!fields.find(f => f === field)) {
          fields.push(field)
        }
      })
    })

    const valuesString = []
    const valueBinds = []
    _.forEach(entryArray, entry => {
      const valueString = []
      _.forEach(fields, field => {
        if (entry[field] !== undefined) {
          valueBinds.push(entry[field])
          valueString.push('?')
        } else if (field === 'uuid') {
          valueBinds.push(this.helpers.string.uuid())
          valueString.push('?')
        } else {
          valueString.push('DEFAULT')
        }
      })
      valuesString.push(`(${valueString.join(', ')})`)
    })

    return knex.raw(`
    INSERT INTO ${this.table} (${fields.join(', ')})
      VALUES ${valuesString.join(', ')}
      ON DUPLICATE KEY UPDATE
      ${fields.map(f => `${f}=VALUES(${f})`).join(', ')}
  `, valueBinds)
  }

  _updAllWhereIn (field, arrayValue, update) {
    return this.knex()
      .update(update)
      .whereIn(field, arrayValue)
  }

  _delAllWhere (where) {
    return this.knex()
      .where(where)
      .del()
  }

  _delAllWhereIn (field, arrayValue) {
    return this.knex()
      .whereIn(field, arrayValue)
      .del()
  }

  async _add (entry = {}) {
    if (this.isUuid) {
      entry.uuid = this.helpers.string.uuid()
    }
    await this.knex().insert(entry)
    return entry
  }

  async _addArray (entries) {
    if (this.isUuid) {
      entries.forEach(entry => { entry.uuid = this.helpers.string.uuid() })
    }
    await this.knex().insert(entries)
    return entries
  }

}
