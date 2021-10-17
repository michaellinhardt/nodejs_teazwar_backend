process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const configEnv = require(`${__dirname}/env/${process.env.NODE_ENV}.env.js`)

const { importByFilename } = require('../helpers/files/imports.helper')
const config = importByFilename(`${__dirname}/files`, '.config')

const _ = require('lodash')

module.exports = _.merge({}, config, configEnv)
