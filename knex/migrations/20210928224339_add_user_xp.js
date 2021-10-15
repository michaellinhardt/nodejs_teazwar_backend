const { createTableDefaultSetup } = require('../../helpers/files/knex.helper')

const tableName = 'user_xp'

const { xp } = require('../../game/config')
const xpHelper = require('../../game/helpers').xp

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('user_uuid', 36).notNullable()

    table.integer('level').defaultTo(xp.startLevel)
    table.integer('level_xp').defaultTo(0)
    table.integer('level_xp_max').defaultTo(xpHelper.xpRequired(xp.startLevel))

  }).then(() => {
    return true
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
