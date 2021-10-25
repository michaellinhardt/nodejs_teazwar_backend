const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'auras'

// DO NOT FORGET TO UPDATE THE CONST 'sqlField'
// INSIDE THE AURA.SUPERCLASS
// IF NOT, IT WILL BUG !!!!

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('aura_uuid', 36).notNullable()
    table.unique('aura_uuid')

    table.string('owner_uuid', 36).notNullable()
    table.string('aura_id').notNullable()

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
