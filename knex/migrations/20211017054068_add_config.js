const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'config'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('config_key').notNullable()
    table.text('config_json')

  }).then(() => {
    const { config } = require('../seeds')
    return knex(tableName).insert(config)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}