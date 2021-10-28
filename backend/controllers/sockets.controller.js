import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/socket/infra/connected'],
    Controller: class extends ControllerSuperclass {
      validator () {
        const { socket, body: { infra_name } } = this
        if (!infra_name || (infra_name !== 'discord' && infra_name !== 'twitch')) {
          this.StopPipeline('socketConnected_invalidInfraName')
        }
        if (!socket) {
          this.StopPipeline('socketConnected_missingSocketClient')
        }
      }

      handler () {
        const { socket, body: { infra_name }, services: s } = this

        socket.join(infra_name)

        const sayKey = infra_name === 'twitch'
          ? 'server_twitchbot_socketConnected' : 'server_discordbot_socketConnected'

        s.socketsInfra.emitSayDiscord([sayKey])
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/socket/disconnected'],
    Controller: class extends ControllerSuperclass {
      validator () {
        const { body: { infra_name, socket_id } } = this
        if (!infra_name && !socket_id) {
          this.StopPipeline('socketDisconnected_missingData')
        }
      }

      handler () {
        const { body: { infra_name, reason }, services: s } = this

        if (infra_name) {
          const sayKey = infra_name === 'twitch'
            ? 'server_twitchbot_socketDisconnected' : 'server_discordbot_socketDisconnected'

          s.socketsInfra.emitSayDiscord([sayKey, reason])
          return true
        }

        // const

      }
    },
  },
]
