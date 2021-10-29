const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'strangers'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('opaque_user_id').notNullable()
    table.unique('opaque_user_id')

    table.text('jwtoken')
    table.string('socket_id')

    table.integer('tslStrangerMessage').defaultTo(0)
    table.biginteger('tslStrangerSeen').defaultTo(0)

  }).then(() => {
    // const { config } = require('../seeds')
    // return knex(tableName).insert(config)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
