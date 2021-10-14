const imports = require(`${__dirname}/../../helpers/files/imports.helper`)
const { importByFilename } = imports
const helpers = importByFilename(`${__dirname}/files`, '.helper')

helpers.imports = imports

module.exports = helpers