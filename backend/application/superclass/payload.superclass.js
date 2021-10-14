import _ from 'lodash'

export default class {

  constructor (ressources, payloadHeader) {
    this.build_ressources(ressources)
    this.savePayloadHeader(payloadHeader)
  }

  savePayloadHeader (payloadHeader) {
    this.payloadHeader = payloadHeader
  }

  build_ressources (ressources) {
    _.forEach(ressources, (ressource, name) => {
      this[name] = ressource
    })
  }

  removePropertiesFromArray (payload, arrProperties) {
    const { helpers: h } = this

    if (h.code.isObject(payload)) {
      _.forEach(arrProperties, property => {
        if (typeof payload[property] !== undefined) {
          delete payload[property]
        }
      })
    }

    _.forEach(payload, value => {
      if (h.code.isObjectOrArray(value)) {
        this.removePropertiesFromArray(value, arrProperties)
      }
    })
  }

  removeGenericProperties (payload) {
    const genericProperties = [
      'id',
      'deleted_at',
      'isDeleted',
      'user_uuid',
    ]

    this.removePropertiesFromArray(payload, genericProperties)
  }

  build (payload) {
    const { helpers: h } = this

    if (!h.code.isObject(payload)) {
      return { [this.payloadHeader]: payload }
    }

    this.removeGenericProperties(payload)

    if (this.blacklistProperties) {
      const arrBlacklistProperties = this.blacklistProperties()
      this.removePropertiesFromArray(payload, arrBlacklistProperties)
    }

    const buildPayload = {
      ...payload,
    }

    return { [this.payloadHeader]: buildPayload }
  }

}
