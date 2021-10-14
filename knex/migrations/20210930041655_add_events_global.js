const { createTableDefaultSetup } = require('../../helpers').knex

const tableName = 'events_global'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('event_name').notNullable()
    table.text('event_data')
    table.boolean('isObs').defaultTo(false)
    table.boolean('isExtention').defaultTo(false)
    table.boolean('isBotTwitch').defaultTo(false)
    table.boolean('isBotDiscord').defaultTo(false)

  }).then(() => {
    const { events_global } = require('../seeds')
    return knex(tableName).insert(events_global)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
