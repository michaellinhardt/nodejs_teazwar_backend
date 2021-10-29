import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isPublic: true,
    route: ['post', '/extension/user/auth'],
    Controller: class extends ControllerSuperclass {
      validator () {
        const { data: d } = this
        if (!d.jwtoken || !d.jwtoken.token) {
          return this.StopPipeline('jwtoken_missingToken')
        }
      }

      async handler () {
        const { data: d, body: b, services: s, helpers: h, modules: m } = this

        const user_id = _.get(d, 'jwtoken.user_id', undefined)
        const opaque_user_id = _.get(d, 'jwtoken.opaque_user_id', undefined)
        const socket = _.get(b, 'big_data.socket', {})

        const logUser = async user => {
          socket.join('users')
          s.socketsInfra.emitSayDiscord(
            ['stream_connection_registered', user.display_name])
          await s.users.setJwtokenByUserId(user_id, d.jwtoken.token, socket.id)
          return this.payloads.user.authSuccess()
        }

        const logStranger = async opaque_user_id => {
          socket.join('strangers')
          s.socketsInfra.emitSayDiscord(['stream_connection_unregistered'])
          await s.strangers.addOrUpdOpaqueUser({
            opaque_user_id,
            jwtoken: d.jwtoken.token,
            socket_id: socket.id,
            tslStrangerSeen: h.date.timestampMs(),
          })
          return this.payloads.user.authSuccess()
        }

        if (d.user) { return logUser(d.user) }

        if (user_id) {

          const isUser = await s.users.getByUserId(user_id)
          if (isUser) { return logUser(isUser) }

          const userIds = [user_id]
          const users = await m.users.createByUserIds(userIds)

          const allUsers = users.added.concat(users.updated)
          const user = allUsers[0]

          s.socketsInfra
            .emitSayDiscord(['stream_extension_validate_account', user.display_name])

          return logUser(user)

        } else if (opaque_user_id) { return logStranger(opaque_user_id) }

        return this.payloads.user.authFail()

      }
    },
  },
]
