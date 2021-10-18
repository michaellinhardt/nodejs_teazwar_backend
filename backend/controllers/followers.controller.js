import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/cron/global/following'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        const channel = await s.users.getChannel()
        const user = await s.users.getOneGlobalFollowing()

        if (!channel || !user) {
          return p.cron.empty()
        }

        const isFollowing = await a.follows.check(channel.user_id, user.user_id)

        if (user.isFollower === 'maybe'
            || (user.isFollower === 'no' && isFollowing.length)
            || (user.isFollower === 'yes' && !isFollowing.length)) {
          // const countFollow = isFollowing.length > 0 ? user.countFollow + 1 : user.countFollow
          // await s.eventsGlobal.addEvent('global_following_change', {
          //   countFollow,
          //   username: user.username,
          //   previous: user.isFollower,
          //   current: (isFollowing.length > 0) })
        }

        await s.users.updateFollowing(user, isFollowing)

        p.cron.success()
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/cron/chatters/unfollower'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this

        const channel = await s.users.getChannel()
        const user = await s.users.getOneChatterUnFollower()

        if (!channel || !user) {
          return p.cron.empty()
        }

        const isFollowing = await a.follows.check(channel.user_id, user.user_id)

        if (user.isFollower === 'maybe'
            || (user.isFollower === 'no' && isFollowing.length)
            || (user.isFollower === 'yes' && !isFollowing.length)) {
          // const countFollow = isFollowing.length > 0 ? user.countFollow + 1 : user.countFollow
          // await s.eventsGlobal.addEvent('chatters_un_follower', {
          //   countFollow,
          //   username: user.username,
          //   previous: user.isFollower,
          //   current: (isFollowing.length > 0) })
        }

        await s.users.updateFollowing(user, isFollowing)

        p.cron.success()
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/cron/chatters/newfollower'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        const channel = await s.users.getChannel()
        const user = await s.users.getOneChatterNewFollower()

        if (!channel || !user) {
          return p.cron.empty()
        }

        const isFollowing = await a.follows.check(channel.user_id, user.user_id)

        if (user.isFollower === 'maybe'
            || (user.isFollower === 'no' && isFollowing.length)
            || (user.isFollower === 'yes' && !isFollowing.length)) {
          // const countFollow = isFollowing.length > 0 ? user.countFollow + 1 : user.countFollow
          // await s.eventsGlobal.addEvent('chatters_new_follower', {
          //   countFollow,
          //   username: user.username,
          //   previous: user.isFollower,
          //   current: (isFollowing.length > 0) })
        }

        await s.users.updateFollowing(user, isFollowing)

        p.cron.success()
      }
    },
  },
]
