import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    route: ['get', '/aaaEmtpy'],
    isPublic: false,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { data: d, renders: r, payloads: p } = this
        const { user: { uuid: user_uuid } } = d

        this.payload = await p.getAll(user_uuid)
        r.Ok()
      }
    },
  },
]
