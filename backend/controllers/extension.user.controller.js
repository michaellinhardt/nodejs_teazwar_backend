import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isPublic: true,
    isTwitch: true,
    route: ['post', '/extension/user/auth'],
    Controller: class extends ControllerSuperclass {
      validator () {
        const { data: d } = this
        if (!d.jwtoken || !d.jwtoken.token) {
          return this.StopPipeline('jwtoken_missingToken')
        }
      }

      async handler () {
        const { data: d, body: b, services: s } = this

        const user_id = _.get(d, 'jwtoken.user_id', undefined)
        const opaque_user_id = _.get(d, 'jwtoken.opaque_user_id', undefined)
        const socket = _.get(b, 'big_data.socket', {})

        const logUser = async user => {
          s.socketsInfra.emitSayDiscord(
            ['stream_connection_registered', user.username])
          console.debug('LOG USER', socket.id)
          await s.users.setJwtokenByUserId(user_id, d.jwtoken.token, socket.id)
          return this.payloads.user.authSuccess()
        }

        const logStranger = async opaque_user_id => {
          s.socketsInfra.emitSayDiscord(['stream_connection_unregistered'])
          await s.strangers.addOrUpdOpaqueUser(opaque_user_id, d.jwtoken.token, socket.id)
          return this.payloads.user.authSuccess()
        }

        if (d.user) { return logUser(d.user) }

        if (user_id) {
          const isUser = await s.users.getByUserId(user_id)
          if (isUser) { return logUser(isUser) }

        } else if (opaque_user_id) {
          return logStranger(opaque_user_id)
        }

        return this.payloads.user.authFail()

      }
    },
  },
]
