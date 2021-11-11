import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isStranger: true,
    route: ['post', '/extension/cutscene/exit'],
    Controller: class extends ControllerSuperclass {
      validator () {
        const { config: c, body: b } = this

        if (!b.cutscene_id) { this.StopPipeline('cutsceneExit_missingId') }

        if (!c.cutscene.exitable[b.cutscene_id]) {
          this.StopPipeline('cutsceneExit_badId')
        }
      }

      handler () {
        const { modules: m } = this

        // m.strangerCutscene

        this.payload = { ok: 1 }
      }
    },
  },
]
