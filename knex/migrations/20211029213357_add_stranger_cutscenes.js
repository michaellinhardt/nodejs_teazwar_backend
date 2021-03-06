const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'stranger_cutscenes'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('opaque_user_id', 36).notNullable()

    table.string('cutscene_id').notNullable()
    table.string('scene_id').notNullable().defaultTo('entry')

    table.biginteger('tslCutsceneComplete').defaultTo(0)

    table.unique(['opaque_user_id', 'cutscene_id'])

  }).then(() => {
    // const { user_sub_tables } = require('../seeds')
    // return knex(tableName).insert(user_sub_tables)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
