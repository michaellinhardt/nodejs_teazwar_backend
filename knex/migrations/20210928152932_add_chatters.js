const { createTableDefaultSetupNoUuid } = require('../../helpers/files/knex.helper')

const tableName = 'chatters'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetupNoUuid(knex, table)

    table.string('username').defaultTo('')
    table.integer('count_seen').defaultTo(0)

    table.biginteger('tsuTwitchDataUpToDate').defaultTo(0)

    table.unique('username')

  }).then(() => {
    // const { chatters } = require('../seeds')
    // return knex(tableName).insert(chatters)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
