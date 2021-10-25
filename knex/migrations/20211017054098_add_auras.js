const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'auras'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('owner_uuid', 36).notNullable()
    table.string('aura_id').notNullable()

    // either user_uuid or null ('combat', 'ooc', 'global', 'self')
    table.string('target_uuid').defaultTo(null)

    table.biginteger('tic').notNullable().defaultTo(-1)
    table.biginteger('tsnTic').notNullable().defaultTo(-1)
    table.biginteger('tsuActive').notNullable().defaultTo(-1)

  }).then(() => {
    // const { config } = require('../seeds')
    // return knex(tableName).insert(config)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
