const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'user_auras'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('user_uuid', 36).notNullable()
    table.string('aura_id').notNullable()

    // either user_uuid or 'combat', 'ooc', 'global'
    table.string('target').notNullable()

    // maximum duration, 1 = 1 min, -1 = infinite
    table.bigint('tic_max').notNullable()
    table.bigint('tic').notNullable()

  }).then(() => {
    // const { config } = require('../seeds')
    // return knex(tableName).insert(config)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
