import _ from 'lodash'
import ModuleSuperclass from '../superclass/module.superclass'

export default class extends ModuleSuperclass {

  async addOrUpdStrangerFromData () {
    const { services: s, data: d, helpers: h, body: b } = this

    const opaque_user_id = _.get(d, 'jwtoken.opaque_user_id', undefined)
    const socket_id = _.get(b, 'big_data.socket.id', undefined)
    const jwtoken = _.get(d, 'jwtoken.token', undefined)

    const stranger = {
      opaque_user_id,
      jwtoken,
      socket_id,
      tslStrangerSeen: h.date.timestampMs(),
    }

    await s.strangers.addOrUpdOpaqueUser(stranger)

    await s.strangerCutscenes.addCutscene('stranger_welcome')

    return stranger
  }

  async cleanTable () {
    const { services: s } = this

    const outdatedStranger = await s.strangers.getOutdatedStrangers()
    const opaqueUserIds = outdatedStranger.map(s => s.opaque_user_id)

    const nbStrangersClean = await this.deleteStrangersByOpaqueUserIds(opaqueUserIds)

    return nbStrangersClean
  }

  async deleteStrangersByOpaqueUserIds (opaqueUserIds) {
    const { services: s, modules: m } = this

    const nbStrangersClean = await s.strangers.deleteByUserOpaqueIds(opaqueUserIds)
    await m.strangerCutscenes.deleteStrangerCutscenes(opaqueUserIds)

    return nbStrangersClean
  }

}
