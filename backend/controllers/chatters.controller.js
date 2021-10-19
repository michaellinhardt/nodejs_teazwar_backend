import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/cron/chatters/listing'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        const chatters = await a.chatters.get()

        const chatter_list = s.chatters.extractChattersDataFromTwitchApi(chatters)

        await s.chatters.addOrIncrement(chatter_list)

        await s.users.setOnline(chatter_list)

        await s.socketsInfra.emitSayDiscord(['twitch_chatters_listing', chatter_list.length])

        p.cron.success()
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/cron/chatters/validate'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        const chatters = await s.chatters.getNextValidateList()

        if (chatters.length === 0) {
          p.cron.empty()
          return true
        }

        const chatterUsernames = chatters.map(c => c.username)

        const twitchUsers = await a.users.getByUsernames(chatterUsernames)

        const users = await s.users.addOrUpdate(twitchUsers)
        const allUsers = users.added.concat(users.updated)

        await s.userXp.addMissingEntry(allUsers)
        await s.userStats.addMissingEntry(allUsers)
        await s.userAttributes.addMissingEntry(allUsers)

        await s.chatters.setUsersAsValidated(allUsers)

        await s.socketsInfra.emitSayDiscord(
          ['twitch_chatters_validate_update', users.updated.length],
          users.updated.length > 0)

        await s.socketsInfra.emitSayDiscord(
          ['twitch_chatters_validate_add', users.added.length],
          users.added.length > 0)

        p.cron.success()
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/cron/chatters/bots'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        const apiBots = await a.bots.list()
        const dbBots = await s.bots.getAll()

        const apiUsernames = apiBots.map(b => ({ username: b[0] }))
        const dbUsernames = dbBots.map(b => ({ username: b.username }))

        const addedBots = await s.bots.addMissing(apiUsernames, dbUsernames)
        const deletedBots = await s.bots.deleteMissing(apiUsernames, dbUsernames)

        const taggedBots = await s.users.tagBots(apiBots)

        await s.socketsInfra.emitSayDiscord(
          ['stream_chatters_bot_added', addedBots.length],
          addedBots.length > 0)

        await s.socketsInfra.emitSayDiscord(
          ['stream_chatters_bot_deleted', deletedBots.length],
          deletedBots.length > 0)

        if (taggedBots.length) {
          const detectedBot = taggedBots.map(b => b.username).join(' , ')
          const { teazyou_discord_user_id } = this.config.discord

          await s.socketsInfra.emitSayDiscord(['stream_chatters_bot_detected',
            teazyou_discord_user_id, taggedBots.length, detectedBot])
        }

        return !taggedBots.length ? p.cron.empty() : p.cron.success()

      }
    },
  },
]
