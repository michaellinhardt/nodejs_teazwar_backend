const { driver, mysql } = require('../../config/files/database.config')
let knex = null

module.exports = {
  get: () => {
    if (!knex) { knex = (require('knex'))(driver) }

    return knex
  },

  createTableDefaultSetup: (knex, table) => {

    table.charset(mysql.charset)
    table.collate(mysql.collate)
    table.increments('id').primary()
  },

}
