import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    route: ['get', '/aaaEmtpy'],
    isPublic: true,
    Controller: class extends ControllerSuperclass {
      handler () {
        const { data: d, body: b } = this
        // const { user } = d
        // eslint-disable-next-line no-undef
        generateError()

        this.payload = { yolo: 'swag', body: b, data: d }
      }
    },
  },
  {
    route: ['get', '/aaaEmtpy/:ok'],
    isPublic: true,
    Controller: class extends ControllerSuperclass {
      handler () {
        const { data: d, body: b } = this
        // const { user } = d
        // eslint-disable-next-line no-undef
        generateError()

        this.payload = { yolo: 'swagos', body: b, data: d }
      }
    },
  },
]
