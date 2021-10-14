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
        await s.eventsGlobal.addEventForDiscord('teazwar_connected')
        r.Ok()
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
        await s.eventsGlobal.addEventFromTwitch(event_name, event_data)
        r.Ok()
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
        await s.eventsGlobal.addEventForDiscord('teazwar_join', twitchData)
        r.Ok()
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
        await s.eventsGlobal.addEventForDiscord('teazwar_part', twitchData)
        r.Ok()
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
        if (!user_id) { return r.Ok() }

        const user = await s.users.getByUserId(user_id)
        if (!user) { return r.Ok() }

        await s.userChat.incrementStats(user, twitchData.msg)

        r.Ok()
      }
    },
  },
]
