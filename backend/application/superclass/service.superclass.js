import _ from 'lodash'

export default class {

  constructor (table, filePath, ressources) {
    this.build_ressources(ressources)
    this.setName(filePath)
    this.setModelTable(table)
    this.copyModel()
  }

  setModelTable (table) {
    this.table = table
    if (table) {
      this.models[this.name].setTable(table)
    }
  }

  copyModel () {
    if (!this.table) { return true }
    const arrMethods = this.helpers.code.getAllMethods(this.models[this.name])
    _.forEach(arrMethods, name => {
      if (name.charAt(0) === '_' && name.charAt(1) !== '_') {
        this[name.slice(1)] = this.models[this.name][name]
      }
    })
  }

  setName (filePath) {
    const filePathArr = filePath.split('/')
    const filename = (filePathArr[(filePathArr.length - 1)])
      .replace('.service', '')
      .replace('.js', '')
    this.name = this.helpers.string.camelCaseFileName(filename)
  }

  build_ressources (ressources) {
    _.forEach(ressources, (ressource, name) => {
      this[name] = ressource
    })
  }

  async getBy (key, value) {
    const isSaved = _.get(this, `db.${this.table}.${key}[${value}]`, undefined)
    if (isSaved !== undefined) { return isSaved }

    const data = await this.getFirstWhere({ [key]: value })
    _.set(this, `db.${this.table}.${key}[${value}]`, data)

    return data
  }

}
