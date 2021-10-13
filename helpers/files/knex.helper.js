const { driver, mysql } = require('../../config/files/database.config')
let knex = null

module.exports.default = {
  get: () => {
    if (!knex) { knex = (require('knex'))(driver) }

    return knex
  },

  createTableDefaultSetup: (knex, table) => {

    table.charset(mysql.charset)
    table.collate(mysql.collate)

    table.increments('id').primary()

    table.string('uuid', 36).notNullable()

    table.boolean('isDeleted').notNullable().defaultTo(false)

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    table.timestamp('deleted_at')

    table.unique('uuid')
  },

}
