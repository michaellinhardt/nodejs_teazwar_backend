const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'stranger_cutscenes'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('opaque_user_id', 36).notNullable()

    table.string('cutscene_id').notNullable()
    table.text('cutscene_data')

    table.biginteger('tslCutsceneComplete').defaultTo(0)

  }).then(() => {
    // const { user_sub_tables } = require('../seeds')
    // return knex(tableName).insert(user_sub_tables)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
