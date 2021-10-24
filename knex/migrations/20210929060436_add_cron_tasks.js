const { createTableDefaultSetupNoUuid } = require('../../helpers/files/knex.helper')

const tableName = 'cron_tasks'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetupNoUuid(knex, table)

    table.string('path').notNullable()
    table.biginteger('tsnCronTaskExec').defaultTo(0)

    table.unique('path')

  }).then(() => {
    const { cron_tasks } = require('../seeds')
    return knex(tableName).insert(cron_tasks)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
