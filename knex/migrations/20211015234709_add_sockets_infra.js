const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'sockets_infra'

exports.up = function (knex) {
    return knex.schema.createTable(tableName, table => {
        createTableDefaultSetup(knex, table)
        
        table.string('infra_name', 36).notNullable()
        table.string('socket_id').defaultTo(null)
  
    }).then(() => {
        const { sockets_infra } = require('../seeds')
        return knex(tableName).insert(sockets_infra)
    })
  }

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
