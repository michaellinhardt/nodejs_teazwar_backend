import _ from 'lodash'

export default class {

  constructor (table, filePath, ressources, isUuid) {
    this.build_ressources(ressources)
    this.setName(filePath)
    this.setModelTable(table, isUuid)
    this.copyModel()
  }

  setModelTable (table, isUuid) {
    this.table = table
    if (table) {
      this.models[this.name].setTable(table)
      this.models[this.name].setIsUuid(isUuid)
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

}
