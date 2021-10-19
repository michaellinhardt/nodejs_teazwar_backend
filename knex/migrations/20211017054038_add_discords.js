const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'discords'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('discord_id').notNullable()

    table.string('discord_username').notNullable()
    table.string('discord_discriminator').notNullable()

    table.string('language')

    table.boolean('isBot')
    table.boolean('isSystem')

    table.string('verify_otp').defaultTo(null)
    table.biginteger('verify_expire_timestamp').defaultTo(0)
    table.biginteger('verify_timestamp').defaultTo(0)

    table.biginteger('joinedTimestamp').defaultTo(0)

  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}