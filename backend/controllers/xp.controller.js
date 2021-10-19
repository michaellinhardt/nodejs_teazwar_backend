import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/cron/xp/levelup'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p } = this
        const requireLevelUp = await s.userXp.getUsersRequiringLvlUp()

        if (requireLevelUp.length === 0) {
          return p.cron.empty()
        }

        const updated = await s.userXp.increaseOneLevelForUsers(requireLevelUp)

        if (updated.length === 1) {
          const user = updated[0]
          const discordPing = user.discord_id ? ` <@${user.discord_id}> ` : ''
          await s.socketsInfra.emitSayDiscord(
            ['game_level_up_one', discordPing, user.display_name, user.level])
          await s.socketsInfra.emitSayTwitch(
            ['level_up_one', user.display_name, user.level])

        } else {
          const levelUpArrayTwitch = []
          const levelUpArrayDiscord = []
          _.forEach(updated, user => {
            levelUpArrayTwitch.push(`=[ @${user.display_name} ${user.level} ]=`)

            const discordUser = user.discord_id
              ? `[ <@${user.discord_id}> ${user.display_name} ${user.level} ]`
              : `[ ${user.display_name} ${user.level} ]`

            levelUpArrayDiscord.push(discordUser)
          })

          await s.socketsInfra
            .emitSayDiscord(['game_level_up_multi', levelUpArrayDiscord.join('=')])
          await s.socketsInfra
            .emitSayTwitch(['level_up_multi', levelUpArrayTwitch.join('=')])
        }

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
