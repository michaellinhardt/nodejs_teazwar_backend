const { importByFilename } = require('../helpers/files/imports.helper')
const languages = {
  en: importByFilename(`${__dirname}/en`, '.en.language'),
  fr: importByFilename(`${__dirname}/fr`, '.fr.language'),
}

module.exports = languages
