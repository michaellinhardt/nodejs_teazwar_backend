const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'user_attributes'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('user_uuid', 36).notNullable()

    table.integer('vit').defaultTo(0)
    table.integer('end').defaultTo(0)
    table.integer('wil').defaultTo(0)
    table.integer('str').defaultTo(0)
    table.integer('int').defaultTo(0)

    table.unique('user_uuid')

  }).then(() => {
    return true
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
