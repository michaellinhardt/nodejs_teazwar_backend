import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/cron/xp/levelup'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p } = this
        const requireLevelUp = await s.userXp.getRequireLevelUp()

        if (requireLevelUp.length === 0) {
          return p.cron.empty()
        }

        await s.userXp.increaseLevel(requireLevelUp)

        p.cron.success()
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/cron/chatters/xpgain'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p } = this
        const chatters = await s.chatters.getNextXpGain()
        const chattersFlatten = s.chatters.flattenChattersObject(chatters)

        if (chatters.length === 0) {
          return p.cron.empty()
        }

        const chatterUsernames = chatters.map(c => c.username)
        const users = await s.users.getByUsernames(chatterUsernames)

        await s.userXp.addXpGain(users, chattersFlatten)
        await s.userStats.incrementSeenStats(users, chattersFlatten)

        await s.chatters.resetByUsernames(chatterUsernames)

        p.cron.success()
      }
    },
  },
]
