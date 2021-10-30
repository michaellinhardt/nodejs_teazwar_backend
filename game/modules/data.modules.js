// import _ from 'lodash'
import ModuleSuperclass from '../superclass/module.superclass'

export default class extends ModuleSuperclass {

  getAllData () {
    return this.data.user
      ? this.getAllDataUser()
      : this.getAllDataStranger()
  }

  async getAllDataStranger () {
    const { data: d, modules: m } = this

    const cutscene = await m.strangerCutscenes.getDataCutscene(d.stranger.opaque_user_id)

    const data = {
      cutscene,
    }

    return data
  }

  getAllDataUser () {
    return {}
  }

}
