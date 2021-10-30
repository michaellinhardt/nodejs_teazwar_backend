import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isStranger: true,
    route: ['post', '/extension/data/init'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { modules: m } = this

        const data = await m.data.getAllData()

        this.payload.isDataInit = true
        this.payload = {
          ...this.payload,
          ...data,
          isDataInit: true,
        }
      }
    },
  },
]
