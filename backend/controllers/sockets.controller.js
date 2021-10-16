import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/socket/infra/connected'],
    Controller: class extends ControllerSuperclass {
      async validator () {
        const { body: { infra_name, socket_id }, services: s } = this
        if (!infra_name || (infra_name !== 'discord' && infra_name !== 'twitch')) {
          await this.StopPipeline('socketConnected_invalidInfraName')
        }
        if (!socket_id || _.isEmpty(socket_id)) {
          await this.StopPipeline('socketConnected_missingId')
        }
      }

      async handler () {
        const { body: { infra_name, socket_id }, services: s } = this
        await s.socketsInfra.connected(infra_name, socket_id)
        this.payload = { success: true }
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/socket/disconnected'],
    Controller: class extends ControllerSuperclass {
      async validator () {
        const { body: { socket_id }, services: s } = this
        if (!socket_id || _.isEmpty(socket_id)) {
          await this.StopPipeline('socketDisconnected_missingId')
        }
      }

      async handler () {
        const { body: { socket_id }, services: s } = this
        await s.socketsInfra.disconnected(socket_id)
        await s.users.socketDisconnected(socket_id)
        this.payload = { success: true }
      }
    },
  },
]