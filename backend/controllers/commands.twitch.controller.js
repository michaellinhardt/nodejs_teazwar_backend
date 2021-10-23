import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/twitch/command/discord'],
    Controller: class extends ControllerSuperclass {
      validator () {
        const { body: b } = this
        const otpArray = b.msg.split(' ')

        if (!otpArray[1] || otpArray[1].length !== 6) {
          this.StopPipeline('twitchVerify_badOtp')
        }

        this.data.otp = otpArray[1].toUpperCase()
        const user_id = _.get(b, 'userstate.["user-id"]', null)
        const displayName = _.get(b, 'userstate.["display-name"]', '')
        const username = _.get(b, 'userstate.username', '')

        if (!user_id || !displayName) {
          this.StopPipeline('twitchVerify_unknowTwitchUser')
        }

        this.data.username = username
        this.data.twitch_id = user_id
        this.data.displayName = displayName
      }

      async handler () {
        const { apis: a, data: d, services: s, helpers: h } = this

        const discord = await s.discords.getByOtp(d.otp)
        if (!discord) {
          return s.socketsInfra
            .emitSayTwitch(['discord_verfy_noOtp', d.displayName])
        }

        const user = await s.users.getByUserId(d.twitch_id)
        if (!user) {
          await s.discords.deleteOtpByOtp(d.otp)
          return s.socketsInfra
            .emitSayTwitch(['discord_verfy_noUser', d.displayName])
        }

        const currTimestamp = h.date.timestamp()
        if (discord.tsuDiscordOtpValid < currTimestamp) {
          const validity_minutes = this.config.discord.itvDiscordOtpValidity / 60
          return s.socketsInfra
            .emitSayTwitch(['discord_verfy_expired', d.displayName, validity_minutes])
        }

        await a.discord.addMembresRole(discord.discord_id)

        await s.discords.validateByOtp(d.otp)
        await s.users.setDiscordIds(user, discord)

        if (discord.tslDiscordOtpValidated === 0) {
          // TODO give rewards
        }

        const sayKey = discord.tslDiscordOtpValidated === 0
          ? 'discord_verified_first' : 'discord_verified_notFirst'
        s.socketsInfra.emitSayTwitch([sayKey, d.displayName])
      }

    },
  },
  {
    isTeazwar: true,
    route: ['post', '/twitch/command/delation'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { body: b, services: s } = this

        const displayName = _.get(b, 'userstate.["display-name"]', '')
        const onlineBots = await s.users.getOnlineBots()
        return !onlineBots.length
          ? s.socketsInfra.emitSayTwitch(['delation_none', displayName])
          : s.socketsInfra.emitSayTwitch(['delation_detected',
            displayName,
            onlineBots.length,
            onlineBots.map(b => `@${b.username}`).join(' , ')])

      }

    },
  },
]
