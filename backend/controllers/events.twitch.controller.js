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

        await s.socketsInfra
          .emitSayDiscord(['server_twitchbot_twitchConnected', address, port])

      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/twitch/join'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s } = this
        const { username, self } = this.body

        const isBot = await s.bots.getByUsername(username)
        if (!self && isBot) {
          s.socketsInfra.emitSayTwitch(['bot_joined', username])
          s.socketsInfra.emitSayDiscord(
            ['stream_bot_joined', this.config.discord.teazyou_discord_user_id, username])

        } else {
          const isUser = await s.users.getByUsername(username)
          const discordPing = this.helpers.format.userDiscordPing(isUser)

          const event = self ? 'server_twitchbot_joined' : 'stream_viewer_joined'
          s.socketsInfra.emitSayDiscord([event, discordPing, username])
        }

      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/twitch/part'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, helpers: h } = this
        const { username, self } = this.body

        const isBot = await s.bots.getByUsername(username)
        if (!self && isBot) {
          s.socketsInfra.emitSayTwitch(['bot_leaved', username])
          s.socketsInfra.emitSayDiscord(
            ['stream_bot_leaved', this.config.discord.teazyou_discord_user_id, username])

        } else {
          const isUser = await s.users.getByUsername(username)
          const discordPing = h.format.userDiscordPing(isUser)

          const event = self ? 'server_twitchbot_leaved' : 'stream_viewer_leaved'
          s.socketsInfra.emitSayDiscord([event, discordPing, username])
        }

      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/twitch/chat'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, body: b, modules: m } = this
        if (b.self) { return false }

        const user_id = _.get(b, 'userstate[\'user-id\']', null)
        if (!user_id) { return false }

        const user = await s.users.getFullByUserId(user_id)
        if (!user) { return false }

        const newStats = await s.userStats.incrementChatStats(user, b.msg)

        const isXpGain = await m.xp.addXpForChatline(user, user.tslXpChatLine, newStats.tslChatLine)

        if (!isXpGain) { return false }

        s.socketsInfra.emitSayDiscord(['spam_xp_chatline', user.display_name])

      }
    },
  },
]
