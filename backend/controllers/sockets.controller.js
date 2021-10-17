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

        if (infra_name === 'twitch') {
          const { socket_id: discord_socket_id } = await s.socketsInfra.getByName('discord')
          this.payload.emit = [discord_socket_id, { say: ['server_twitchbot_socketConnected'] }]
        }
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/socket/disconnected'],
    Controller: class extends ControllerSuperclass {
      async validator () {
        const { body: { socket_id, infra_name }, services: s } = this
        if ((!socket_id || _.isEmpty(socket_id))
        && (!infra_name || _.isEmpty(infra_name))) {
          await this.StopPipeline('socketDisconnected_missingData')
        }
        if (infra_name && infra_name !== 'discord' && infra_name !== 'twitch') {
          await this.StopPipeline('socketDisconnected_invalidInfraName')
        }
      }

      async handler () {
        const { body: { socket_id, infra_name }, services: s } = this

        if (socket_id) {
          await s.socketsInfra.disconnected(socket_id)
          await s.users.socketDisconnected(socket_id)

        } else if (infra_name) {
          await s.socketsInfra.disconnectedByName(infra_name)

        }
        this.payload = { success: true }
      }
    },
  },
]
