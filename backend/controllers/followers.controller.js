import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/cron/global/following'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        try {

          const channel = await s.users.getChannel()
          const user = await s.users.getOneGlobalFollowing()

          if (!channel || !user) {
            this.payload = p.cron.empty()
            return true
          }

          const isFollowing = await a.follows.check(channel.user_id, user.user_id)

          if (user.isFollower === 'maybe'
            || (user.isFollower === 'no' && isFollowing.length)
            || (user.isFollower === 'yes' && !isFollowing.length)) {
            const countFollow = isFollowing.length > 0 ? user.countFollow + 1 : user.countFollow
            // await s.eventsGlobal.addEvent('global_following_change', {
            //   countFollow,
            //   username: user.username,
            //   previous: user.isFollower,
            //   current: (isFollowing.length > 0) })
          }

          await s.users.updateFollowing(user, isFollowing)

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
    route: ['post', '/cron/chatters/unfollower'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        try {

          const channel = await s.users.getChannel()
          const user = await s.users.getOneChatterUnFollower()

          if (!channel || !user) {
            this.payload = p.cron.empty()
            return true
          }

          const isFollowing = await a.follows.check(channel.user_id, user.user_id)

          if (user.isFollower === 'maybe'
            || (user.isFollower === 'no' && isFollowing.length)
            || (user.isFollower === 'yes' && !isFollowing.length)) {
            const countFollow = isFollowing.length > 0 ? user.countFollow + 1 : user.countFollow
            // await s.eventsGlobal.addEvent('chatters_un_follower', {
            //   countFollow,
            //   username: user.username,
            //   previous: user.isFollower,
            //   current: (isFollowing.length > 0) })
          }

          await s.users.updateFollowing(user, isFollowing)

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
    route: ['post', '/cron/chatters/newfollower'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        try {

          const channel = await s.users.getChannel()
          const user = await s.users.getOneChatterNewFollower()

          if (!channel || !user) {
            this.payload = p.cron.empty()
            return true
          }

          const isFollowing = await a.follows.check(channel.user_id, user.user_id)

          if (user.isFollower === 'maybe'
            || (user.isFollower === 'no' && isFollowing.length)
            || (user.isFollower === 'yes' && !isFollowing.length)) {
            const countFollow = isFollowing.length > 0 ? user.countFollow + 1 : user.countFollow
            // await s.eventsGlobal.addEvent('chatters_new_follower', {
            //   countFollow,
            //   username: user.username,
            //   previous: user.isFollower,
            //   current: (isFollowing.length > 0) })
          }

          await s.users.updateFollowing(user, isFollowing)

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
