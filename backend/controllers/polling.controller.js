import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    route: ['post', '/twitch/polling'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { renders: r, services: s, payloads: p } = this
        // const isEvent = await s.eventsGlobal.getEvent('isBotTwitch')
        this.payload = await p.polling.pollingTwitch(isEvent)
      }
    },
  },
  {
    route: ['delete', '/twitch/event'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { renders: r, services: s, req: { body } } = this
        const { event_uuid } = body
        // await s.eventsGlobal.tagEvent(event_uuid, 'isBotTwitch')
      }
    },
  },
  {
    route: ['post', '/discord/polling'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { renders: r, services: s, payloads: p } = this
        // const isEvent = await s.eventsGlobal.getEvent('isBotDiscord')
        this.payload = await p.polling.pollingDiscord(isEvent)
      }
    },
  },
  {
    route: ['delete', '/discord/event'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { renders: r, services: s, req: { body } } = this
        const { event_uuid } = body
        // await s.eventsGlobal.tagEvent(event_uuid, 'isBotDiscord')
      }
    },
  },
]
