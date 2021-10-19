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
          await s.socketsInfra.emitSayTwitch(['bot_joined', username])
          await s.socketsInfra.emitSayDiscord(
            ['stream_bot_joined', username, this.config.discord.teazyou_discord_user_id])

        } else {
          const isUser = await s.users.getByUsername(username)
          const isDiscordId = _.get(isUser, 'discord_id', null)
          const discordKey = isDiscordId ? ` <@${isDiscordId}> ` : ''

          const event = self ? 'server_twitchbot_joined' : 'stream_viewer_joined'
          await s.socketsInfra.emitSayDiscord([event, username, discordKey])
        }

      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/twitch/part'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s } = this
        const { username, self } = this.body

        const isBot = await s.bots.getByUsername(username)
        if (!self && isBot) {
          await s.socketsInfra.emitSayTwitch(['bot_leaved', username])
          await s.socketsInfra.emitSayDiscord(
            ['stream_bot_leaved', username, this.config.discord.teazyou_discord_user_id])

        } else {
          const isUser = await s.users.getByUsername(username)
          const isDiscordId = _.get(isUser, 'discord_id', null)
          const discordKey = isDiscordId ? ` <@${isDiscordId}> ` : ''

          const event = self ? 'server_twitchbot_leaved' : 'stream_viewer_leaved'
          await s.socketsInfra.emitSayDiscord([event, username, discordKey])
        }

      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/twitch/chat'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, body: b } = this

        const user_id = _.get(b.twitchData, 'userstate[\'user-id\']', null)
        if (!user_id) { return true }

        const user = await s.users.getByUserId(user_id)
        if (!user) { return true }

        await s.userStats.incrementChatStats(user, b.twitchData.msg)
      }
    },
  },
]
