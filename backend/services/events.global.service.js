import * as Promise from 'bluebird'
import _ from 'lodash'

import ServiceSuperclass from '../application/superclass/service.superclass'

// const { chatbot, cron } = require('../../config')
const table = 'events_global'

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources) }

  addEvent (event_name, data = {}) {
    const event_data = JSON.stringify(data)
    return this.add({ event_name, event_data })
  }

  addEventFromTwitch (event_name, data = {}) {
    const event_data = JSON.stringify(data)
    return this.add({ event_name, event_data, isBotTwitch: true })
  }

  addEventFromDiscord (event_name, data = {}) {
    const event_data = JSON.stringify(data)
    return this.add({ event_name, event_data, isBotDiscord: true })
  }

  addEventForTwitch (event_name, data = {}) {
    const event_data = JSON.stringify(data)
    return this.add({
      event_name, event_data,
      isObs: true,
      isExtention: true,
      isBotDiscord: true,
    })
  }

  addEventForDiscord (event_name, data = {}) {
    const event_data = JSON.stringify(data)
    return this.add({
      event_name, event_data,
      isObs: true,
      isExtention: true,
      isBotTwitch: true,
    })
  }

  tagEvent (uuid, booleanPlateform) {
    return this.updAllWhere({ uuid }, { [booleanPlateform]: true })
  }

  getEvent (booleanPlateform) {
    return this.getFirstWhere({ [booleanPlateform]: false })
  }

}
