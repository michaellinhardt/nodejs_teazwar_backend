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

        await s.socketsInfra.buildEmitSayArray('discord')
        s.socketsInfra.pushToEmitSay(['server_twitchbot_twitchConnected', address, port])

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

        await s.socketsInfra.buildEmitSayArray('discord')
        const event = self ? 'server_twitchbot_joined' : 'stream_viewer_joined'
        s.socketsInfra.pushToEmitSay([event, channel, username])

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

        await s.socketsInfra.buildEmitSayArray('discord')
        const event = self ? 'server_twitchbot_leaved' : 'stream_viewer_leaved'
        s.socketsInfra.pushToEmitSay([event, channel, username])

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
