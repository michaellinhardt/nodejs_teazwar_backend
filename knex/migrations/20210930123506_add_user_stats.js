const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'user_stats'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('user_uuid', 36).notNullable()

    table.integer('total_lines').defaultTo(0)
    table.integer('total_chars').defaultTo(0)
    table.integer('chars_per_line').defaultTo(0)

    table.integer('chat_seen_normal').defaultTo(0)
    table.integer('chat_seen_follower').defaultTo(0)
    table.integer('chat_seen_subscriber').defaultTo(0)

    table.integer('extension_seen_normal').defaultTo(0)
    table.integer('extension_seen_follower').defaultTo(0)
    table.integer('extension_seen_subscriber').defaultTo(0)

    table.biginteger('timestampLastChatLine').defaultTo(0)

    table.unique('user_uuid')

  }).then(() => {
    return true
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
