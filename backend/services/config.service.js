import _ from 'lodash'
import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'config'

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources) }

  async getByGroup (config_group) {
    const group = await this.getAllLastWhere({ config_group })
    _.forEach(group, (item, config_key) => {
      group[config_key] = JSON.parse(item.config_json)
    })
    return group
  }

  async get (config_key) {
    const { config_json } = await this.getLastWhere({ config_key })
    return JSON.parse(config_json)
  }

  async set (config_key, value) {
    const config_json = JSON.stringify(value)
    await this.updAllWhere({ config_key }, { config_json })
    return value
  }

  async sets (configObject) {
    const configArray = []
    _.forEach(configObject, (config_json, config_key) => {
      configArray.push({ config_json: JSON.stringify(config_json), config_key })
    })

    await this.addOrUpd(configArray)
    return configObject
  }

  async gets (config_keys) {
    const configs = await this.getAllLastWhereIn('config_key', config_keys)
    const results = {}
    _.forEach(configs, config => {
      results[config.config_key] = JSON.parse(config.config_json)
    })

    return results
  }

}
