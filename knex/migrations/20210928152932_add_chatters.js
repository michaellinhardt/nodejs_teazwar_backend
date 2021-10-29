const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'chatters'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('username').notNullable()
    table.unique('username')

    table.integer('count_seen').defaultTo(0)
    table.biginteger('tsuTwitchDataUpToDate').defaultTo(0)

  }).then(() => {
    // const { chatters } = require('../seeds')
    // return knex(tableName).insert(chatters)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
