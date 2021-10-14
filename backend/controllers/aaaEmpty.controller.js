import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    route: ['get', '/aaaEmtpy'],
    isPublic: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { data: d, body: b } = this
        // const { user } = d

        this.payload = { yolo: 'swag', body: b, data: d }
      }
    },
  },
  {
    route: ['get', '/aaaEmtpy/:ok'],
    isPublic: false,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { data: d, body: b } = this
        // const { user } = d

        this.payload = { yolo: 'swagos', body: b, data: d }
      }
    },
  },
]
