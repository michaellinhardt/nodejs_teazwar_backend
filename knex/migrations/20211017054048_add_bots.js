const { createTableDefaultSetupNoUuid } = require('../../helpers/files/knex.helper')

const tableName = 'bots'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetupNoUuid(knex, table)

    table.string('username').notNullable()

    table.unique('username')

  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
