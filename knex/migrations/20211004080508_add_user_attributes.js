const { createTableDefaultSetupNoUuid } = require('../../helpers/files/knex.helper')

const tableName = 'user_attributes'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetupNoUuid(knex, table)

    table.string('user_uuid', 36).notNullable()

    table.integer('vit').defaultTo(0)
    table.integer('end').defaultTo(0)
    table.integer('wil').defaultTo(0)
    table.integer('str').defaultTo(0)
    table.integer('int').defaultTo(0)

    table.unique('user_uuid')

  }).then(() => {
    const { user_sub_tables } = require('../seeds')
    return knex(tableName).insert(user_sub_tables)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
