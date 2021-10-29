const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'user_cutscenes'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('opaque_user_id', 36).notNullable()

    table.string('cutscene').notNullable()
    table.string('scene').defaultTo(null)
    table.string('step').defaultTo(null)

    table.biginteger('tslCutsceneComplete').defaultTo(0)

  }).then(() => {
    // const { user_sub_tables } = require('../seeds')
    // return knex(tableName).insert(user_sub_tables)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
