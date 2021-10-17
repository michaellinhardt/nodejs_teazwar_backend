import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/twitch/connected'],
    Controller: class extends ControllerSuperclass {
      handler () {
        this.payload = {}
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/twitch/event'],
    Controller: class extends ControllerSuperclass {
      handler () {
        this.payload = {}
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/twitch/join'],
    Controller: class extends ControllerSuperclass {
      handler () {
        this.payload = {}
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/twitch/part'],
    Controller: class extends ControllerSuperclass {
      handler () {
        this.payload = {}
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/twitch/chat'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s } = this
        const { twitchData = {} } = this.req.body

        const user_id = _.get(twitchData, 'userstate[\'user-id\']', null)
        if (!user_id) { return true }

        const user = await s.users.getByUserId(user_id)
        if (!user) { return true }

        await s.userStats.incrementChatStats(user, twitchData.msg)
      }
    },
  },
]
