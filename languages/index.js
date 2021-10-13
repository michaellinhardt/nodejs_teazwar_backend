const { importMerged } = require('../helpers/files/imports.helper')
const languages = {
    en: importMerged(`${__dirname}/en`),
    fr: importMerged(`${__dirname}/fr`),
}

module.exports = languages