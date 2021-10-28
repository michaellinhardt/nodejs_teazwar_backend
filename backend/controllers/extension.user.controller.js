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
        const { data: d, services: s } = this

        if (d.user) { return this.payloads.user.authSuccess() }

        const user_id = _.get(d, 'jwtoken.user_id', undefined)
        const opaque_user_id = _.get(d, 'jwtoken.opaque_user_id', undefined)
        const socket = _.get(d, 'big_data.socket', {})

        if (user_id) {
          const isUser = await s.users.getByUserId(user_id)
          if (isUser) {

            s.socketsInfra.emitSayDiscord(
              ['stream_connection_registered', isUser.username])

            await s.users.setJwtokenByUserId(user_id, d.jwtoken.token, socket.id)

            return this.payloads.user.authSuccess()
          }
        }

        if (opaque_user_id) {
          const isStranger = await s.strangers
            .addOrUpdOpaqueUser({ opaque_user_id, socket_id: socket.id })
          if (isStranger) {

            s.socketsInfra.emitSayDiscord(['stream_connection_unregistered'])

            await s.strangers.addOrUpdOpaqueUser(user_id, d.jwtoken.token, socket.id)

            return this.payloads.user.authSuccess()
          }

        }

        return this.payloads.user.authFail()

      }
    },
  },
]
