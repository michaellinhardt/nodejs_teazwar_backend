const { v1 } = require('uuid')
const { createTableDefaultSetupNoUuid } = require('../../helpers/files/knex.helper')
const { cron } = require('../../config')

const tableName = 'cron_tasks'

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    createTableDefaultSetupNoUuid(knex, table)

    table.string('path').notNullable()
    table.biginteger('tsnCronTaskExec').defaultTo(0)

    table.unique('path')

  }).then(() => {
    const cronTasks = cron.tasks.map(c => ({
      uuid: v1(),
      path: c.path,
    }))
    cronTasks.unshift({
      uuid: v1(),
      path: 'twitch',
    })
    return knex(tableName).insert(cronTasks)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName)
}
