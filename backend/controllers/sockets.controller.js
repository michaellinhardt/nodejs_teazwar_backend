import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/socket/infra/connected'],
    Controller: class extends ControllerSuperclass {
      validator () {
        const { body: { infra_name, socket_id } } = this
        if (!infra_name || (infra_name !== 'discord' && infra_name !== 'twitch')) {
          this.StopPipeline('socketConnected_invalidInfraName')
        }
        if (!socket_id || _.isEmpty(socket_id)) {
          this.StopPipeline('socketConnected_missingId')
        }
      }

      async handler () {
        const { body: { infra_name, socket_id }, services: s } = this
        await s.socketsInfra.connected(infra_name, socket_id)
        this.payload = { success: true }

        const { socket_id: discord_socket_id } = await s.socketsInfra.getByName('discord')

        if (infra_name === 'twitch') {
          this.payload.emit = [discord_socket_id, { say: ['server_twitchbot_socketConnected'] }]
        } else if (infra_name === 'discord') {
          this.payload.say = ['server_discordbot_socketConnected']
        }
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/socket/disconnected'],
    Controller: class extends ControllerSuperclass {
      validator () {
        const { body: { socket_id, infra_name } } = this
        if ((!socket_id || _.isEmpty(socket_id))
        && (!infra_name || _.isEmpty(infra_name))) {
          this.StopPipeline('socketDisconnected_missingData')
        }
        if (infra_name && infra_name !== 'discord' && infra_name !== 'twitch') {
          this.StopPipeline('socketDisconnected_invalidInfraName')
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
