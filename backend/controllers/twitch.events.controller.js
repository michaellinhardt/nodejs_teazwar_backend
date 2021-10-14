import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    route: ['post', '/twitch/connected'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, renders: r } = this
        // await s.eventsGlobal.addEventForDiscord('teazwar_connected')
      }
    },
  },
  {
    route: ['post', '/twitch/event'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, renders: r } = this
        const { event_name, event_data = {} } = this.req.body
        // await s.eventsGlobal.addEventFromTwitch(event_name, event_data)
      }
    },
  },
  {
    route: ['post', '/twitch/join'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, renders: r } = this
        const { twitchData = {} } = this.req.body
        // await s.eventsGlobal.addEventForDiscord('teazwar_join', twitchData)
      }
    },
  },
  {
    route: ['post', '/twitch/part'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, renders: r } = this
        const { twitchData = {} } = this.req.body
        // await s.eventsGlobal.addEventForDiscord('teazwar_part', twitchData)
      }
    },
  },
  {
    route: ['post', '/twitch/chat'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, renders: r } = this
        const { twitchData = {} } = this.req.body

        const user_id = _.get(twitchData, 'userstate[\'user-id\']', null)
        if (!user_id) { return true }

        const user = await s.users.getByUserId(user_id)
        if (!user) { return true }

        await s.userChat.incrementStats(user, twitchData.msg)
      }
    },
  },
]
