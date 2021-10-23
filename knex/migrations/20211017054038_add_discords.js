const { createTableDefaultSetupNoUuid } = require('../../helpers/files/knex.helper')

const tableName = 'discords'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetupNoUuid(knex, table)

    table.string('discord_id').notNullable()

    table.string('discord_username').notNullable()
    table.string('discord_discriminator').notNullable()

    table.boolean('isBot')
    table.boolean('isSystem')

    table.string('verify_otp').defaultTo(null)
    table.biginteger('tsuDiscordOtpValid').defaultTo(0)
    table.biginteger('tslDiscordOtpValidated').defaultTo(0)

    table.biginteger('joinedTimestamp').defaultTo(0)

    table.unique('discord_id')

  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
