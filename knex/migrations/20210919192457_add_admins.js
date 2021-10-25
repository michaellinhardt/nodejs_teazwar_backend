const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'admins'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('user_uuid', 36).notNullable()

    // table.boolean('pause').defaultTo(false)

    table.unique('user_uuid')

  }).then(() => {
    const { admins } = require('../seeds')
    return knex(tableName).insert(admins)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
