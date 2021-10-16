import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/cron/xp/levelup'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        try {
  
          const requireLevelUp = await s.userXp.getRequireLevelUp()

          if (requireLevelUp.length === 0) {
            this.payload = p.cron.empty()
            return true
          }

          await s.userXp.increaseLevel(requireLevelUp)

          // await s.eventsGlobal.addEventForDiscord('chatters_level_up', { chatters_level_up: requireLevelUp.length })

          this.payload = p.cron.success()

        } catch (err) {
          console.error(err)
          this.payload = p.cron.error()
        }
        return true
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/cron/chatters/xpgain'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        try {
  
          const chatters = await s.chatters.getNextXpGain()
          const chattersFlatten = s.chatters.flattenChattersObject(chatters)

          if (chatters.length === 0) {
            this.payload = p.cron.empty()
            return true
          }

          const chatterUsernames = chatters.map(c => c.username)
          const users = await s.users.getByUsernames(chatterUsernames)

          await s.userXp.addXpGain(users, chattersFlatten)
          await s.userStats.incrementSeenStats(users, chattersFlatten)

          await s.chatters.resetByUsernames(chatterUsernames)

          this.payload = p.cron.success()

        } catch (err) {
          console.error(err)
          this.payload = p.cron.error()
        }
        return true
      }
    },
  },
]