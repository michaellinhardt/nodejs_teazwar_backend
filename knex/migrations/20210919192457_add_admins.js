const { createTableDefaultSetup } = require('../../helpers').knex

const tableName = 'admins'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('user_uuid', 36).notNullable()

    table.boolean('pause').defaultTo(false)
    table.boolean('resume').defaultTo(false)
    table.boolean('xppermin').defaultTo(false)

  }).then(() => {
    const { admins } = require('../seeds')
    return knex(tableName).insert(admins)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
