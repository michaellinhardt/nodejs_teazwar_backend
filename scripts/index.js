const fs = require('fs')
const Knex = require('knex')
const { exec } = require('child_process')

const { database: { mysql: db, driver: knexConfig } } = require('../config')
let knex

const setKnexNoDatabase = () => {
  delete knexConfig.connection.database
  knex = Knex(knexConfig)
  knexConfig.connection.database = db.database
}

const setKnexDatabase = () => {
  knexConfig.connection.database = db.database
  knex = Knex(knexConfig)
}

const setKnex = (noDatabase = false) => {
  if (noDatabase) {
    try {
      setKnexNoDatabase()
    } catch (err) { setKnexDatabase() }
  } else {
    try {
      setKnexDatabase()
    } catch (err) { setKnexNoDatabase() }
  }
}

const addColor = message => {
  return message
    .replace(/\[RED\]/gm, '\x1b[31m')
    .replace(/\[GREEN\]/gm, '\x1b[32m')
    .replace(/\[YELLOW\]/gm, '\x1b[33m')
    .replace(/\[YELL\]/gm, '\x1b[33m')
    .replace(/\[BLUE\]/gm, '\x1b[36m')
    .replace(/\[\/.*\]/gm, '\x1b[0m')
}

const stop = (error = 0) => process.exit(error)

const log = (message, error_code = null) => {
  process.stdout.write(`${addColor(message)}\x1b[0m\n`)
  if (error_code !== null) { stop(error_code) }
}

const done = msg => log(`  [YELLOW]Done!\n${(msg ? `     [YELLOW]- ${msg}\n` : '')}`, 0)
const fail = msg => log(`  [RED]Fail!\n${(msg ? `     [RED]- ${msg}\n` : '')}`, 1)

const exec_shell = cmd => {
  exec(cmd, (error, stdout, stderr) => {
    const errMsg = !stderr && (!error || !error.message) ? null : (stderr || error.message)
    return errMsg ? fail(errMsg) : done(stdout)
  })
}

const scripts = {

  create: async (internal = true) => {
    setKnex(true)
    await knex.raw(`
    CREATE DATABASE IF NOT EXISTS \`${knexConfig.connection.database}\`
    CHARACTER SET ${db.charset}
    COLLATE ${db.collate};`)
    setKnex()

    return internal ? true : done()
  },

  delete: async (internal = true) => {
    setKnex(true)
    await knex.raw(`
    DROP DATABASE IF EXISTS \`${knexConfig.connection.database}\`;`)
    setKnex()

    return internal ? true : done()
  },

  rollback: async (internal = true) => {
    setKnex()
    await knex.migrate.rollback()

    return internal ? true : done()
  },

  latest: async (internal = true) => {
    setKnex()
    await knex.migrate.latest()

    return internal ? true : done()
  },

  seed: async (internal = true) => {
    setKnex(true)
    const sql = fs.readFileSync(`${__dirname}/seed.sql`).toString()
    await knex.raw(`DROP DATABASE  \`${knexConfig.connection.database}\``)
    await knex.raw(`CREATE DATABASE  \`${knexConfig.connection.database}\``)
    setKnex()
    await knex.raw(sql)

    return internal ? true : done()
  },

  ls: () => exec_shell('ls -la'),

  jwtoken: () => {
    const { generate } = require('../helpers/jwtoken.helper').default
    return generate(process.argv[3])
  },

}

scripts.file = async () => {
  const Script = require(`${__dirname}/files/${process.argv[3]}.script.js`)
  process.stdout.write('====================\n\n')
  await Script()
  process.stdout.write('\n====================\n')
  return done()
}

scripts.redis_reset = async () => {
  const RedisHelper = require('../helpers/files/redis.helper')
  await RedisHelper.reset()
  return done()
}

scripts.reset = async (internal = true) => {
  const RedisHelper = require('../helpers/files/redis.helper')
  await RedisHelper.reset()
  await scripts.delete(true)
  await scripts.create(true)
  await scripts.latest(internal)
}

scripts.run = async () => {

  // Log the arguments used when calling this functions
  log(`
  Env [GREEN]${process.env.NODE_ENV}[/GREEN]
  Database [GREEN]${knexConfig.connection.database}[/GREEN]
  Script [GREEN]${process.argv[2]}[/GREEN]!\n`)

  // Execute the related script if exist
  // The false argument ensure the execution of exit command after the script is Done
  if (scripts[process.argv[2]]) {
    await scripts[process.argv[2]](false)

  } else {
    // Log the available scripts if the one passed in argument dont exist
    log(`
    [RED]Bad script arg!
    [BLUE]seed, reset, latest, rollback`, 1)
  }

}

module.exports = scripts
