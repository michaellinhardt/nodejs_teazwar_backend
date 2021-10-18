import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/debug/discord/report'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, body: b } = this
        if (!b.errorArray || !Array.isArray(b.errorArray)) {
          return false
        }
        await s.socketsInfra.emitError(b.errorArray)
      }
    },
  },
]
