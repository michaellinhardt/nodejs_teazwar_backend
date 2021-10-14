const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'user_chat'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('user_uuid', 36).notNullable()

    table.integer('total_lines').defaultTo(0)
    table.integer('total_chars').defaultTo(0)
    table.integer('chars_per_line').defaultTo(0)

    table.integer('timestampLastLine').defaultTo(0)

  }).then(() => {
    return true
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
