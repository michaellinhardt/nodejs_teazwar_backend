const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'bots'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('username').notNullable()

  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
