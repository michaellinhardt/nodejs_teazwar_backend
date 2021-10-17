const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'discords'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('discord_id').notNullable()
    table.string('username').notNullable()
    table.string('discriminator').notNullable()

    table.string('language')

    table.boolean('isBot')
    table.boolean('isSystem')

    table.text('verify_otp')
    table.integer('verify_timestamp').defaultTo(0)

  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
