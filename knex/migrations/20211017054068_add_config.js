const _ = require('lodash')
const { createTableDefaultSetupNoUuid } = require('../../helpers/files/knex.helper')

const tableName = 'config'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetupNoUuid(knex, table)

    table.string('config_group')
    table.string('config_key').notNullable()
    table.text('config_json')

    table.unique('config_key')

  }).then(() => {
    const { config } = require('../seeds')
    return _.isEmpty(config) ? null : knex(tableName).insert(config)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
