const { createTableDefaultSetup } = require('../../helpers').knex

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

  }).then(() => {
    return true
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
