import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/cron/chatters/unfollower'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a, helpers: h } = this

        const channel = await s.users.getChannel()
        const user = await s.users.getOneChatterFollowing()

        if (!channel || !user) { return p.cron.empty() }

        const isFollowing = await a.follows.check(channel.user_id, user.user_id)
        await s.users.updateFollowing(user, isFollowing)

        if (!isFollowing.length) {
          const countFollow = isFollowing.length > 0 ? user.countFollow + 1 : user.countFollow
          const countFollowTimes = countFollow === 1 ? `${countFollow}er` : `${countFollow}eme`
          const discordPing = h.format.userDiscordPing(user)

          s.socketsInfra.emitSayDiscord(
            ['stream_un_follower', discordPing, user.display_name, countFollowTimes])

          s.socketsInfra.emitSayTwitch(
            ['un_follower', user.display_name, countFollowTimes])
        }

        p.cron.success()
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/cron/chatters/newfollower'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a, helpers: h } = this
        const channel = await s.users.getChannel()
        const user = await s.users.getOneChatterNotFollowing()

        if (!channel || !user) { return p.cron.empty() }

        const isFollowing = await a.follows.check(channel.user_id, user.user_id)
        await s.users.updateFollowing(user, isFollowing)

        if (!isFollowing.length) { return p.cron.success() }

        const countFollow = isFollowing.length > 0 ? user.countFollow + 1 : user.countFollow
        const countFollowTimes = countFollow === 1 ? `${countFollow}er` : `${countFollow}eme`
        const discordPing = h.format.userDiscordPing(user)
        const event = countFollow === 1 ? 'new_follower' : 're_follower'

        s.socketsInfra.emitSayDiscord(
          [`stream_${event}`, discordPing, user.display_name, countFollowTimes])

        s.socketsInfra.emitSayTwitch(
          [event, user.display_name, countFollowTimes])

        p.cron.success()
      }
    },
  },
]
