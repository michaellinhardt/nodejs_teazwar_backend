import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/twitch/connected'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s } = this
        const { address, port } = this.body
        const { socket_id: discord_socket_id } = await s.socketsInfra.getByName('discord')
        this.payload.emit = [discord_socket_id,
          { say: ['server_twitchbot_twitchConnected', address, port] }]
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/twitch/join'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s } = this
        const { channel, username, self } = this.body
        const { socket_id: discord_socket_id } = await s.socketsInfra.getByName('discord')
        const event = self ? 'server_twitchbot_joined' : 'stream_viewer_joined'
        this.payload.emit = [discord_socket_id,
          { say: [event, channel, username] }]
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/twitch/part'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s } = this
        const { channel, username, self } = this.body
        const { socket_id: discord_socket_id } = await s.socketsInfra.getByName('discord')
        const event = self ? 'server_twitchbot_leaved' : 'stream_viewer_leaved'
        this.payload.emit = [discord_socket_id,
          { say: [event, channel, username] }]
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/twitch/chat'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, body: b } = this

        const user_id = _.get(b.twitchData, 'userstate[\'user-id\']', null)
        if (!user_id) { return true }

        const user = await s.users.getByUserId(user_id)
        if (!user) { return true }

        await s.userStats.incrementChatStats(user, b.twitchData.msg)
      }
    },
  },
]
