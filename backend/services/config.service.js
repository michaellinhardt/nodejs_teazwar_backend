import * as Promise from 'bluebird'
import _ from 'lodash'
import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'config'

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources) }

  async get (config_key) {
    if (Array.isArray(config_key)) { return this.gets(config_key) }
    const { config_json } = await this.getLastWhere({ config_key })
    if (!config_json) { return null }

    return (JSON.parse(config_json)).value
  }

  async set (config_key, value) {
    const isConfig = await this.getFirstWhere({ config_key })
    const config_json = JSON.stringify({ value })

    if (!isConfig) {
      await this.add({ config_key, config_json })
    } else {
      await this.updAllWhere({ config_key }, { config_json })
    }

    return value
  }

  async sets (configObject) {
    const configArray = []
    _.forEach(configObject, (config_json, config_key) =>
      configArray.push([config_key, config_json]))

    await Promise.each(configArray, configItem =>
      this.set(configItem[0], configItem[1])
    , { concurrency: 3 })

    return configObject
  }

  async gets (config_keys) {
    const configs = await this.getAllLastWhereIn('config_key', config_keys)
    const results = {}
    _.forEach(configs, config => {
      results[config.config_key] = (JSON.parse(config.config_json)).value
    })

    return results
  }

}
