const { createTableDefaultSetup } = require('../../../application/helpers/knex.helper').default

const tableName = 'user_xp'

const { xp } = require('../../../config')
const XpHelper = require('../../helpers/xp.helper').default

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetup(knex, table)

    table.string('user_uuid', 36).notNullable()

    table.integer('level').defaultTo(xp.startLevel)
    table.integer('level_xp').defaultTo(0)
    table.integer('level_xp_max').defaultTo(XpHelper.xpRequired(xp.startLevel))

    table.integer('total_xp_normal').defaultTo(0)
    table.integer('total_xp_follower').defaultTo(0)
    table.integer('total_xp_subscriber').defaultTo(0)

  }).then(() => {
    return true
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}