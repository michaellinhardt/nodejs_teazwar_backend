const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'chatters'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('username').defaultTo('')
    table.integer('count_seen').defaultTo(1)

    table.biginteger('timestampValidatedUntil').defaultTo(0)

  }).then(() => {
    // const { chatters } = require('../seeds')
    // return knex(tableName).insert(chatters)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
