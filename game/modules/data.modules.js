// import _ from 'lodash'
import ModuleSuperclass from '../superclass/module.superclass'

export default class extends ModuleSuperclass {

  getAllData () {
    return this.data.user
      ? this.getAllDataUser()
      : this.getAllDataStranger()
  }

  async getAllDataStranger () {
    const { data: d, modules: m, helpers: h } = this

    const currTimestamp = h.date.timestampMs()

    const cutscene = await m.strangerCutscenes.getDataCutscene(d.stranger.opaque_user_id)
    cutscene.listener_cutscene_cutscene = currTimestamp

    const data = {
      cutscene,
    }

    return data
  }

  getAllDataUser () {
    return {}
  }

}
