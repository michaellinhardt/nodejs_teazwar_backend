const { createTableDefaultSetupNoUuid } = require('../../helpers/files/knex.helper')

const tableName = 'user_stats'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetupNoUuid(knex, table)

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
    const { user_sub_tables } = require('../seeds')
    return knex(tableName).insert(user_sub_tables)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
