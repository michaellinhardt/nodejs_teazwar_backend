import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/cron/xp/bonus/perma/group'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { payloads: p, modules: m, services: s, helpers: h, redis: r } = this

        const { xpbonus_perma_group: current } = await r.get('xpbonus_perma_group')

        const {
          xpbonus_perma_group,
          xpbonus_perma_group_details,
        } = await m.xp.calculateBonusPermaGroup()

        if (xpbonus_perma_group !== current) {

          const details = h.format.xpBonusGroupDetails(xpbonus_perma_group_details)
          await s.socketsInfra
            .emitSayDiscord(['game_xpbonus_perma_group', xpbonus_perma_group,
              details])

          await s.socketsInfra
            .emitSayTwitch(['xpbonus_perma_group', xpbonus_perma_group])
        }

        p.cron.success()
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/cron/xp/levelup'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, modules: m, helpers: h } = this

        const updated = await m.xp.increaseOneLevelForUsers()
        if (updated.length === 0) { return p.cron.empty() }

        if (updated.length === 1) {
          const user = updated[0]
          const discordPing = h.format.userDiscordPing(user)
          s.socketsInfra.emitSayDiscord(
            ['game_level_up_one', discordPing, user.display_name, user.level])
          s.socketsInfra.emitSayTwitch(
            ['level_up_one', user.display_name, user.level])

        } else {
          const levelUpArrayTwitch = []
          const levelUpArrayDiscord = []
          _.forEach(updated, user => {
            levelUpArrayTwitch.push(h.format.userTwitchLevlUp(user))
            levelUpArrayDiscord.push(h.format.userDiscordLevlUp(user))
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
        const { services: s, modules: m, payloads: p } = this
        const chatters = await s.chatters.getNextXpGain()
        const chattersFlatten = s.chatters.flattenChattersObject(chatters)

        if (chatters.length === 0) { return p.cron.empty() }

        const chatterUsernames = chatters.map(c => c.username)
        const users = await s.users.getByUsernames(chatterUsernames)

        await m.xp.addXpGainToChatters(users, chattersFlatten)
        await s.userStats.incrementSeenStats(users, chattersFlatten)

        await s.chatters.resetByUsernames(chatterUsernames)

        p.cron.success()
      }
    },
  },
]
